import sys
import platform

imie = "Hanna"
nr_indeksu = "57893"

wersja = platform.python_version()
sciezka= sys.executable

print(f"Hello {imie} ({nr_indeksu}). This environment is using Python version {wersja} at location {sciezka}")

