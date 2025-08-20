import csv
from collections import Counter

# Usar el nombre exacto del archivo
archivo = "/workspaces/backend-registro/csv_imports/padron_victimas.csv"

with open(archivo, 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    datos = list(reader)

print('=== ANÁLISIS DE FRECUENCIAS POR COLUMNA ===\n')

for columna in reader.fieldnames:
    valores = [fila[columna] for fila in datos]
    contador = Counter(valores)
    unicos = len(contador)
    total = len(valores)
    
    print(f'--- {columna} ---')
    print(f'Total únicos: {unicos} de {total} registros')
    
    if unicos <= 20:
        print('Valores y frecuencias:')
        for valor, freq in contador.most_common(15):
            print(f'  "{valor}": {freq} veces')
        if unicos > 15:
            print(f'  ... y {unicos - 15} valores más')
    else:
        print('Top 10 valores más frecuentes:')
        for valor, freq in contador.most_common(10):
            print(f'  "{valor}": {freq} veces')
    
    print()
