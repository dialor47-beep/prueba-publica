#!/bin/bash

# Script de inicio para la Plataforma Educativa
echo "🚀 Iniciando Plataforma Educativa..."

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado"
    echo "📥 Descarga e instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar que el archivo server.js existe
if [ ! -f "server.js" ]; then
    echo "❌ Error: Archivo server.js no encontrado"
    echo "📁 Asegúrate de estar en el directorio de la plataforma educativa"
    exit 1
fi

# Iniciar el servidor
echo "🌐 Iniciando servidor en puerto 4000..."
echo "📚 URL de acceso: http://localhost:4000"
echo ""
echo "👤 Credenciales por defecto:"
echo "   Usuario: admin"
echo "   Contraseña: admin123"
echo ""
echo "⏹️  Para detener el servidor: Ctrl+C"
echo "🚀 ¡Plataforma lista para usar!"
echo ""

node server.js