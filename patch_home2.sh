awk '
BEGIN { p = 1 }
/<div className="p-4 md:p-8 space-y-6 max-w-7xl mx-auto">/ {
    system("cat home_replacement.txt")
    p = 0
}
p == 1 { print }
/<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mt-8">/ {
    if (p == 0) p = 1
    next
}
' src/App.tsx > src/App_temp.tsx && mv src/App_temp.tsx src/App.tsx
