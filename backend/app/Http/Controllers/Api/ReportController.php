<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;
use App\Models\Order;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReportController extends Controller
{
    public function salesByPeriod(Request $request)
    {
        $validated = $request->validate([
            'from' => ['required', 'date_format:Y-m-d'],
            'to' => ['required', 'date_format:Y-m-d', 'after_or_equal:from'],
            'group_by' => ['required', 'in:day,week,month'],
        ]);

        $formats = [
            'day' => '%Y-%m-%d',
            'week' => '%x-W%v',
            'month' => '%Y-%m',
        ];

        $from = CarbonImmutable::createFromFormat('!Y-m-d', $validated['from']);
        $to = CarbonImmutable::createFromFormat('!Y-m-d', $validated['to'])->endOfDay();
        $periodDays = (int) $from->diffInDays($to->startOfDay()) + 1;
        $previousTo = $from->subSecond();
        $previousFrom = $from->subDays($periodDays);

        $eligibleOrders = Order::query()
            ->whereIn('status', ['pending', 'preparing', 'shipped', 'delivered']);

        $currentOrders = (clone $eligibleOrders)->whereBetween('created_at', [$from, $to]);
        $previousTotal = (clone $eligibleOrders)
            ->whereBetween('created_at', [$previousFrom, $previousTo])
            ->sum('total');
        $currentTotal = (clone $currentOrders)->sum('total');

        $sales = (clone $currentOrders)
            ->selectRaw(
                'DATE_FORMAT(created_at, ?) as periodo, SUM(total) as total_ventas, COUNT(*) as cantidad_pedidos, AVG(total) as ticket_promedio',
                [$formats[$validated['group_by']]]
            )
            ->groupBy('periodo')
            ->orderBy('periodo')
            ->get();

        return response()->json([
            'data' => $sales,
            'comparacion' => [
                'total_ventas_actual' => $currentTotal,
                'total_ventas_anterior' => $previousTotal,
                'variacion_porcentual' => (float) $previousTotal === 0.0
                    ? null
                    : round((($currentTotal - $previousTotal) / $previousTotal) * 100, 2),
            ],
        ]);
    }

    public function salesByProduct(Request $request)
    {
        $validated = $request->validate([
            'from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'to' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'limit' => ['sometimes', 'integer', 'min:1'],
        ]);

        if (isset($validated['from'], $validated['to']) && $validated['from'] > $validated['to']) {
            throw ValidationException::withMessages([
                'to' => ['La fecha final debe ser igual o posterior a la fecha inicial.'],
            ]);
        }

        $limit = (int) ($validated['limit'] ?? 10);
        $productsQuery = static function () use ($validated) {
            $query = DB::table('order_items')
                ->join('products', 'products.id', '=', 'order_items.product_id')
                ->join('orders', 'orders.id', '=', 'order_items.order_id')
                ->where('orders.status', '!=', 'cancelled')
                ->select('products.id as producto_id', 'products.name as nombre')
                ->selectRaw('SUM(order_items.quantity) as unidades_vendidas')
                ->selectRaw('SUM(order_items.quantity * order_items.unit_price) as ingresos_generados')
                ->selectRaw('COUNT(DISTINCT order_items.order_id) as numero_pedidos')
                ->groupBy('products.id', 'products.name');

            if (!empty($validated['from'])) {
                $query->whereDate('orders.created_at', '>=', $validated['from']);
            }

            if (!empty($validated['to'])) {
                $query->whereDate('orders.created_at', '<=', $validated['to']);
            }

            return $query;
        };

        return response()->json([
            'mas_vendidos' => $productsQuery()->orderByDesc('ingresos_generados')->limit($limit)->get(),
            'menos_vendidos' => $productsQuery()->orderBy('ingresos_generados')->limit($limit)->get(),
        ]);
    }

    public function salesByCategory(Request $request)
    {
        $validated = $request->validate([
            'from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'to' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
        ]);

        if (isset($validated['from'], $validated['to']) && $validated['from'] > $validated['to']) {
            throw ValidationException::withMessages([
                'to' => ['La fecha final debe ser igual o posterior a la fecha inicial.'],
            ]);
        }

        $categories = DB::table('order_items')
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->join('categories', 'categories.id', '=', 'products.category_id')
            ->join('orders', 'orders.id', '=', 'order_items.order_id')
            ->where('orders.status', '!=', 'cancelled')
            ->when(!empty($validated['from']), fn ($query) => $query->whereDate('orders.created_at', '>=', $validated['from']))
            ->when(!empty($validated['to']), fn ($query) => $query->whereDate('orders.created_at', '<=', $validated['to']))
            ->select('categories.id as categoria_id', 'categories.name as nombre')
            ->selectRaw('SUM(order_items.quantity) as unidades_vendidas')
            ->selectRaw('SUM(order_items.quantity * order_items.unit_price) as ingresos_generados')
            ->selectRaw('COUNT(DISTINCT order_items.product_id) as numero_productos_distintos')
            ->groupBy('categories.id', 'categories.name')
            ->get();

        $totalRevenue = (float) $categories->sum('ingresos_generados');
        $totalUnits = (int) $categories->sum('unidades_vendidas');

        return response()->json($categories->map(fn ($category) => [
            'categoria_id' => (int) $category->categoria_id,
            'nombre' => $category->nombre,
            'unidades_vendidas' => (int) $category->unidades_vendidas,
            'ingresos_generados' => (float) $category->ingresos_generados,
            'numero_productos_distintos' => (int) $category->numero_productos_distintos,
            'porcentaje_de_ingresos' => $totalRevenue > 0
                ? round(((float) $category->ingresos_generados / $totalRevenue) * 100, 2)
                : 0.0,
            'porcentaje_de_unidades' => $totalUnits > 0
                ? round(((int) $category->unidades_vendidas / $totalUnits) * 100, 2)
                : 0.0,
        ]));
    }

    public function lowStockIngredients(Request $request)
    {
        // La base usa current_stock y minimum_stock; se exponen como stock_actual y stock_minimo sin migración.
        $validated = $request->validate([
            'umbral_critico' => ['sometimes', 'numeric', 'min:0', 'max:100'],
        ]);

        $criticalThreshold = (float) ($validated['umbral_critico'] ?? 20);
        $stateOrder = ['critico' => 0, 'bajo' => 1, 'ok' => 2];

        $ingredients = Ingredient::query()
            ->with('products:id,name')
            ->get()
            ->map(function (Ingredient $ingredient) use ($criticalThreshold) {
                $currentStock = (float) $ingredient->current_stock;
                $minimumStock = (float) $ingredient->minimum_stock;
                $availablePercentage = $minimumStock > 0
                    ? ($currentStock / $minimumStock) * 100
                    : 100;

                return [
                    'ingrediente_id' => $ingredient->id,
                    'nombre' => $ingredient->name,
                    'stock_actual' => $currentStock,
                    'stock_minimo' => $minimumStock,
                    'porcentaje_disponible' => round($availablePercentage, 2),
                    'estado' => $availablePercentage < $criticalThreshold
                        ? 'critico'
                        : ($currentStock < $minimumStock ? 'bajo' : 'ok'),
                    'productos_afectados' => $ingredient->products->pluck('name')->values()->all(),
                ];
            })
            ->sort(function (array $first, array $second) use ($stateOrder) {
                $stateComparison = $stateOrder[$first['estado']] <=> $stateOrder[$second['estado']];

                return $stateComparison !== 0
                    ? $stateComparison
                    : $first['porcentaje_disponible'] <=> $second['porcentaje_disponible'];
            })
            ->values();

        return response()->json($ingredients);
    }

    public function ordersByStatus(Request $request)
    {
        $validated = $request->validate([
            'from' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
            'to' => ['sometimes', 'nullable', 'date_format:Y-m-d'],
        ]);

        if (isset($validated['from'], $validated['to']) && $validated['from'] > $validated['to']) {
            throw ValidationException::withMessages([
                'to' => ['La fecha final debe ser igual o posterior a la fecha inicial.'],
            ]);
        }

        $latestStatuses = DB::table('order_status_histories as history')
            ->select('history.order_id', 'history.new_status')
            ->whereRaw('history.id = (
                SELECT latest_history.id
                FROM order_status_histories AS latest_history
                WHERE latest_history.order_id = history.order_id
                ORDER BY latest_history.changed_at DESC, latest_history.id DESC
                LIMIT 1
            )');

        $ordersByStatus = DB::table('orders')
            ->leftJoinSub($latestStatuses, 'latest_status', function ($join) {
                $join->on('orders.id', '=', 'latest_status.order_id');
            })
            ->when(!empty($validated['from']), fn ($query) => $query->whereDate('orders.created_at', '>=', $validated['from']))
            ->when(!empty($validated['to']), fn ($query) => $query->whereDate('orders.created_at', '<=', $validated['to']))
            ->selectRaw('COALESCE(latest_status.new_status, orders.status) as estado')
            ->selectRaw('COUNT(*) as cantidad_pedidos, SUM(orders.total) as monto_total')
            ->groupBy('estado')
            ->orderByDesc('cantidad_pedidos')
            ->get();

        $totalOrders = (int) $ordersByStatus->sum('cantidad_pedidos');

        return response()->json($ordersByStatus->map(fn ($row) => [
            'estado' => $row->estado,
            'cantidad_pedidos' => (int) $row->cantidad_pedidos,
            'monto_total' => (float) $row->monto_total,
            'porcentaje_del_total' => $totalOrders > 0
                ? round(((int) $row->cantidad_pedidos / $totalOrders) * 100, 2)
                : 0.0,
        ])->values());
    }
}