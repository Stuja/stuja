#include<iostream>
using namespace std;

/** Tema 1.

    Nombre del programa: Ejercicio 1 Tema 1.
    Entradas: Número 1, Número 2.
    Restricciones: Ninguna.
    Salida: Suma, resta, multiplicación y división de los dos números.
*/


int main(){

    int numero1, numero2;

    cout << "Introduce el primer numero: ";
    cin >> numero1;
    cout << endl;

    cout << "Introduce el segundo numero: ";
    cin >> numero2;
    cout << endl;

    cout << "Suma: " << numero1 + numero2 << endl;
    cout << "Resta: " << numero1 - numero2 << endl;
    cout << "Multiplicacion: " << numero1 * numero2 << endl;
    cout << "Division: " << numero1 / numero2 << endl;
    cout << endl;

}
