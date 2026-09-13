# PONYTAIL: reglas de trabajo

Aplica siempre esta escalera de decisión, en este orden estricto, antes de proponer o escribir una solución:

1. **YAGNI**: implementa únicamente requisitos actuales y explícitos. No agregues ni sugieras trabajo que no sea necesario ahora.
2. **Reutilizar**: busca primero funciones, componentes y helpers existentes que resuelvan el problema o una parte significativa.
3. **Biblioteca estándar**: úsala antes de instalar paquetes externos.
4. **Función nativa de la plataforma**: prioriza las capacidades ya integradas de Laravel, React y las demás plataformas del proyecto.
5. **Dependencia instalada**: revisa `composer.json` y `package.json`; usa una dependencia existente antes de instalar otra.
6. **Una línea**: si lo anterior no aplica, elige la solución más corta y directa.
7. **Mínimo que funciona**: solo entonces escribe código nuevo, en la cantidad mínima necesaria. No añadas arquitectura especulativa, capas extra ni opciones "por si acaso".

## Reglas adicionales

- No sobre-ingenierices: no agregues abstracciones, patrones ni configuración flexible para el futuro si no se pidió.
- No instales dependencias nuevas sin explicar primero por qué los pasos 1 a 5 no bastan.
- Si el cambio afecta varios archivos o es grande, explica el plan en 2 o 3 líneas y espera confirmación antes de ejecutarlo.
- Prefiere ediciones quirúrgicas sobre reescrituras completas.
- Si la petición tiene una solución más simple que la solicitada, comunícalo antes de implementar la solución literal.
- Genera en español todos los comentarios de código y mensajes de commit.