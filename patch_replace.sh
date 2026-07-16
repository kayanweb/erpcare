awk '
BEGIN { p = 1 }
/{\/\* Top Header Bar - Highly Advanced Glassmorphism \*\/}/ {
    print
    system("cat header_replacement.txt | sed 1d")
    p = 0
}
p == 1 { print }
/<\/header>/ {
    if (p == 0) p = 1
}
' src/App.tsx > src/App_temp.tsx && mv src/App_temp.tsx src/App.tsx
