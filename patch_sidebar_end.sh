awk '
BEGIN { p = 1 }
/<div className="pt-4 border-t border-slate-800">/ {
    if (p == 1) {
        system("echo \"        </nav>\n      </aside>\"")
        p = 0
    }
}
p == 1 { print }
/<\/aside>/ {
    if (p == 0) p = 1
}
' src/App.tsx > src/App_temp.tsx && mv src/App_temp.tsx src/App.tsx
