#include <iostream>
using namespace std;

/**
    Programa: AreaRectangulo
    Entradas: la longitud de los lados.
    Restricciones: Lados >0.
    Salida: El área del rectángulo.
*/


int main(){

    int lado1, lado2;

    cout << "Introduce el lado 1: ";
    cin >> lado1;
    cout << endl;

    cout << "Introduce el lado 2: ";
    cin >> lado2;
    cout << endl;

    cout << "Esta es el area del rectangulo: " << lado1 * lado2 << endl;
    cout << endl;

    cout << "Fin del programa." << endl;
}
