#!/bin/bash

# Script de inicio rápido para la Plataforma Educativa
# Desarrollado por MiniMax Agent

echo "🚀 ========================================= 🚀"
echo "📚 INICIANDO PLATAFORMA EDUCATIVA"
echo "🚀 ========================================= 🚀"
echo ""
echo "🔍 Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    echo "📥 Descarga Node.js desde: https://nodejs.org"
    echo "   Versión recomendada: 14.x o superior"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"
echo ""

echo "🔧 Verificando directorios..."
mkdir -p public/uploads
mkdir -p data
echo "✅ Directorios creados"
echo ""

echo "🌐 Iniciando servidor..."
echo "   URL: http://localhost:3000"
echo "   Usuario: admin"
echo "   Contraseña: admin123"
echo ""

# Verificar si el archivo server.js existe
if [ ! -f "server.js" ]; then
    echo "❌ Archivo server.js no encontrado"
    echo "   Asegúrate de estar en el directorio correcto"
    exit 1
fi

echo "📋 Instrucciones de uso:"
echo "1. Abre tu navegador web"
echo "2. Ve a: http://localhost:3000"
echo "3. Usa las credenciales predeterminadas"
echo "4. Explora todas las funcionalidades"
echo ""
echo "🛠️ Funcionalidades disponibles:"
echo "   ✅ Registro y login de usuarios"
echo "   ✅ Dashboard con estadísticas"
echo "   ✅ Gestión de cursos"
echo "   ✅ Subida de materiales"
echo "   ✅ Sistema de evaluaciones"
echo "   ✅ Calendario de eventos"
echo "   ✅ Certificaciones"
echo "   ✅ Historial de actividad"
echo ""
echo "🛑 Para detener el servidor: Ctrl+C"
echo ""

# Iniciar el servidor
node server.js