#include <iostream>

using namespace std;

struct Persona{

    string name;
    int dni;
    int year;

};

/**FUNCION 1:
    Devuelve la posicion de la primera persona con el DNI
    indicado o la primera con DNI mayor.
    Si no existe, devuelve el tamaño del vector
*/

int PosicionPersona(int dni, Persona vectorPersona, int tamLogico){

    for (int i = 0; i < tamLogico; i++){
        if (vectorPersona[i].dni >= dni){
            return i;
        }
    }

    return tamLogico;
}

/**FUNCION 2:
    Dado un vector y una posicion, desplaza hacia la derecha todos los valores
    del vector cuya posicion sea igual o mayor que la posicion dada.
*/

void DesplazarDer(Persona vectorPersona, int posicion, int &tamLogico){

    for (int i = 0; i < tamLogico; i++){
        if (i >= posicion){
            vectorPersona[i+1] += vectorPersona[i];
            tamLogico += 1;
        }
    }
}

/**FUNCION 3:
    Dado un vector y una posicion, desplaza hacia la izquierda todos los valores
    del vector cuya posicion sea igual o menor que la posicion dada.
*/

void DesplazarIzq(Persona vectorPersona, int posicion, int &tamLogico){

    for (int i = 0; i < tamLogico; i++){
        if (i > posicion){
            vectorPersona[i-1] += vectorPersona[i];
            tamLogico += 1;
        }
    }
}


/**FUNCION 4:
    Dado un vector, mostrar los datos.
*/

void MostrarDatos(Persona vectorPersona, int tamLogico){

    for (int i = 0; i < tamLogico; i++){
        cout << "PERSONA 1:" << endl;
        cout << vectorPersona[i].nombre << endl;
        cout << vectorPersona[i].dni << endl;
        cout << vectorPersona[i].year << endl;
    }

}

void AddPersona(Persona vectorPersona){

    cout << "Introduce el nombre de la persona: " << endl;

}

int main (){

    const int TAM = 100;
    Persona vectorPersona [TAM]
    int tamLogico = 0;

}
