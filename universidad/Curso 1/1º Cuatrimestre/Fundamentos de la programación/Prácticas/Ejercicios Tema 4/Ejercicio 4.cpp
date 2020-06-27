#include <iostream>
using namespace std;


int main (){

    int numero, totalMayorCero = 0;

    do{
        cout << "Introduce un numero (0 para terminar): ";
        cin >> numero;
        cout << endl;

        if (numero > 0)
            totalMayorCero++;

    } while (numero != 0);

    cout << "Has introducido " << totalMayorCero << " numero(s) mayor(es) que cero";

}



