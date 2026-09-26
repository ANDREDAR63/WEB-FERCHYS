#!/usr/bin/env bash

set -uo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ADMIN_EMAIL="${ADMIN_EMAIL:-admin@ferchys.com}"
ADMIN_PASSWORD="${ADMIN_PASSWORD:-Ferchy123!}"
SERVER_HOST="${SERVER_HOST:-127.0.0.1}"
SERVER_PORT="${SERVER_PORT:-8000}"
BASE_URL="${BASE_URL:-http://${SERVER_HOST}:${SERVER_PORT}}"
TEST_OUTPUT="$SCRIPT_DIR/reporte-tests.txt"
ENDPOINTS_DIR="$SCRIPT_DIR/reporte-endpoints"
SERVER_PID_FILE="$SCRIPT_DIR/.test-reports-server.pid"
TEMP_DIR="$(mktemp -d)"
SERVER_PID=""

declare -a ENDPOINT_RESULTS=()

cleanup() {
    if [[ -n "$SERVER_PID" ]] && kill -0 "$SERVER_PID" 2>/dev/null; then
        kill "$SERVER_PID" 2>/dev/null || true
        wait "$SERVER_PID" 2>/dev/null || true
    fi
    rm -f "$SERVER_PID_FILE"
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT INT TERM

if ! command -v php >/dev/null 2>&1 || ! command -v curl >/dev/null 2>&1; then
    printf 'Error: se requieren php y curl para ejecutar este script.\n' >&2
    exit 1
fi

if command -v python3 >/dev/null 2>&1; then
    PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1; then
    PYTHON_BIN="python"
else
    printf 'Error: se necesita jq o Python para procesar JSON.\n' >&2
    exit 1
fi

printf 'Ejecutando tests ReportControllerTest...\n'
php artisan test --filter=ReportControllerTest 2>&1 | tee "$TEST_OUTPUT"
TEST_EXIT_CODE=${PIPESTATUS[0]}

TESTS_PASSED="$(grep -Eo '[0-9]+ passed' "$TEST_OUTPUT" | awk '{ total += $1 } END { print total + 0 }')"
TESTS_FAILED="$(grep -Eo '[0-9]+ (failed|failures|errors?)' "$TEST_OUTPUT" | awk '{ total += $1 } END { print total + 0 }')"
if [[ "$TESTS_PASSED" -eq 0 && "$TESTS_FAILED" -eq 0 ]]; then
    TESTS_TOTAL="$(grep -Eo 'Tests:[[:space:]]*[0-9]+' "$TEST_OUTPUT" | grep -Eo '[0-9]+' | tail -n 1 || true)"
    if [[ -n "$TESTS_TOTAL" ]]; then
        if [[ "$TEST_EXIT_CODE" -eq 0 ]]; then
            TESTS_PASSED="$TESTS_TOTAL"
        else
            TESTS_FAILED="$TESTS_TOTAL"
        fi
    elif [[ "$TEST_EXIT_CODE" -ne 0 ]]; then
        TESTS_FAILED=1
    fi
fi

mkdir -p "$ENDPOINTS_DIR"
php artisan serve --host="$SERVER_HOST" --port="$SERVER_PORT" >"$TEMP_DIR/laravel-serve.log" 2>&1 &
SERVER_PID=$!
printf '%s\n' "$SERVER_PID" > "$SERVER_PID_FILE"

SERVER_READY=0
for attempt in {1..30}; do
    if ! kill -0 "$SERVER_PID" 2>/dev/null; then
        break
    fi
    if curl -sS -o /dev/null "$BASE_URL/api/login" 2>/dev/null; then
        SERVER_READY=1
        break
    fi
    sleep 1
done

if [[ "$SERVER_READY" -ne 1 ]]; then
    printf 'Error: Laravel no inició en %s.\n' "$BASE_URL" >&2
    if [[ -s "$TEMP_DIR/laravel-serve.log" ]]; then
        cat "$TEMP_DIR/laravel-serve.log" >&2
    fi
    for name in sales-by-period sales-by-product sales-by-category low-stock orders-by-status; do
        printf '{"error":"Laravel no disponible"}\n' > "$ENDPOINTS_DIR/${name}.json"
        ENDPOINT_RESULTS+=("$name: ERROR (servidor no disponible)")
    done
    printf '\nResumen\n'
    printf 'Tests: %s pasaron, %s fallaron (salida completa: %s)\n' "$TESTS_PASSED" "$TESTS_FAILED" "$TEST_OUTPUT"
    for result in "${ENDPOINT_RESULTS[@]}"; do
        printf '%s\n' "$result"
    done
    printf 'Respuestas JSON: %s\n' "$ENDPOINTS_DIR"
    exit 1
fi

LOGIN_PAYLOAD="$("$PYTHON_BIN" -c 'import json,sys; print(json.dumps({"email":sys.argv[1],"password":sys.argv[2]}))' "$ADMIN_EMAIL" "$ADMIN_PASSWORD")"
LOGIN_STATUS="$(curl -sS -o "$TEMP_DIR/login.json" -w '%{http_code}' \
    -H 'Accept: application/json' -H 'Content-Type: application/json' \
    -d "$LOGIN_PAYLOAD" "$BASE_URL/api/login")" || LOGIN_STATUS="000"

if [[ "$LOGIN_STATUS" != "200" ]]; then
    printf 'Error: login Admin falló (HTTP %s). Verifica ADMIN_EMAIL y ADMIN_PASSWORD.\n' "$LOGIN_STATUS" >&2
    if [[ -s "$TEMP_DIR/login.json" ]]; then
        cat "$TEMP_DIR/login.json" >&2
        printf '\n' >&2
    fi
    exit 1
fi

if command -v jq >/dev/null 2>&1; then
    TOKEN="$(jq -r '.token // empty' "$TEMP_DIR/login.json")"
else
    TOKEN="$("$PYTHON_BIN" -c 'import json,sys; print(json.load(open(sys.argv[1])).get("token", ""))' "$TEMP_DIR/login.json")"
fi

if [[ -z "$TOKEN" ]]; then
    printf 'Error: el login respondió 200, pero no incluyó el token esperado.\n' >&2
    exit 1
fi

declare -A ENDPOINTS=(
    [sales-by-period]='/api/reports/sales-by-period?from=2026-01-01&to=2026-12-31'
    [sales-by-product]='/api/reports/sales-by-product?limit=5'
    [sales-by-category]='/api/reports/sales-by-category'
    [low-stock]='/api/reports/low-stock'
    [orders-by-status]='/api/reports/orders-by-status'
)

for name in sales-by-period sales-by-product sales-by-category low-stock orders-by-status; do
    response_file="$TEMP_DIR/${name}.response"
    output_file="$ENDPOINTS_DIR/${name}.json"
    http_status="000"

    if http_status="$(curl -sS -o "$response_file" -w '%{http_code}' \
        -H 'Accept: application/json' -H "Authorization: Bearer $TOKEN" \
        "$BASE_URL${ENDPOINTS[$name]}")"; then
        :
    else
        http_status="000"
    fi

    if [[ -f "$response_file" ]]; then
        if command -v jq >/dev/null 2>&1; then
            jq . "$response_file" > "$output_file" 2>/dev/null || cp "$response_file" "$output_file"
        else
            "$PYTHON_BIN" -m json.tool "$response_file" > "$output_file" 2>/dev/null || cp "$response_file" "$output_file"
        fi
    else
        printf '{}\n' > "$output_file"
    fi

    if [[ "$http_status" == "200" ]]; then
        ENDPOINT_RESULTS+=("$name: 200 OK")
    else
        ENDPOINT_RESULTS+=("$name: ERROR (HTTP $http_status)")
    fi
done

printf '\nResumen\n'
printf 'Tests: %s pasaron, %s fallaron (salida completa: %s)\n' "$TESTS_PASSED" "$TESTS_FAILED" "$TEST_OUTPUT"
for result in "${ENDPOINT_RESULTS[@]}"; do
    printf '%s\n' "$result"
done
printf 'Respuestas JSON: %s\n' "$ENDPOINTS_DIR"

if [[ "$TEST_EXIT_CODE" -ne 0 ]]; then
    exit "$TEST_EXIT_CODE"
fi