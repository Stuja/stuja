#include <iostream>
using namespace std;


int main (){
    const int TAM = 5;
    int vectorEnteros[TAM] = {1, 2, 3, 4, 5};

    for (int i = TAM-1; i >= 0; i--){

        cout << "Elemento " << i << ": " << vectorEnteros[i];
        cout << endl;

    }

}



