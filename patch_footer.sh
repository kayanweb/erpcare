awk '
BEGIN { p = 1 }
/{\/\* Persistent Status Footer - Hides on Print \*\/}/ {
    system("cat footer_replacement.txt")
    p = 0
}
p == 1 { print }
/<\/footer>/ {
    if (p == 0) p = 1
}
' src/App.tsx > src/App_temp.tsx && mv src/App_temp.tsx src/App.tsx
