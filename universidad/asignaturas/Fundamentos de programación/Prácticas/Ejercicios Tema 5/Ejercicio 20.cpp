#include <iostream>
using namespace std;

const int TMAX = 50;

/**
    Descripcion: Devuelve el minimo de una fila de una matriz
    Parametros de entrada:
            m: matriz de enteros
            f: numero de fila
    Valor de retorno: minimo de una fila de la matriz
*/

int MinimoFila(int m[][TMAX], int nfila, int ncolumnas){

    int menor = m[nfila][0];
    for (int i = 1; i < ncolumnas; i++){
        if (m[nfila][i] < menor)
            menor = m[nfila][i];
    }

    return menor;
}

int main(){

    int m[][3] = {{1,2,3}, {2, 6, 7}, {0, -2, 1}};
    int tam = 9;

    cout << "El menor de la fila solicitada es " << MinimoFila(m, 3, 3) << endl;
}


