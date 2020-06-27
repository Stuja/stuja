#include <iostream>
#include <conio.h>
#include <stdlib.h>
using namespace std;

struct Garaje{

    string nombre;
    int capacidad;
    int ocupacion;

};

int tam, coches;
Garaje *garajes;

/**Esta estrategia se basa en llenar el garaje libre con más capacidad hasta rellenarlo del todo*/
int Estrategia1(Garaje vGarajes[], int tam, int coches){

    int mayorCapacidad = (vGarajes[0].capacidad - vGarajes[0].ocupacion);
    int posMayorCapacidad = 0;

    for (int i = 1; i < tam; i++){
        if ((vGarajes[i].capacidad - vGarajes[i].ocupacion) > mayorCapacidad){
            mayorCapacidad = (vGarajes[i].capacidad - vGarajes[i].ocupacion);
            posMayorCapacidad = i;
        }
    }

    if((vGarajes[posMayorCapacidad].ocupacion + coches > vGarajes[posMayorCapacidad].capacidad)){
       cout << "\nNo se han podido guardar los coches en ningun garaje" << endl;
       return 0;
    }

    else{
        cout << "\nSe han guardado "<<coches<<"coches en "<<vGarajes[posMayorCapacidad].nombre << endl;
        vGarajes[posMayorCapacidad].ocupacion += coches;
        return coches;
    }
}



int main (){

    cout << "|| BIENVENIDOS A GARAJES JAVIEROS ||" << endl;
    cout << "\nCuantos garajes has comprado con Bitcoins?" << endl;
    cout << ">";
    cin >> tam;
    garajes = new Garaje[tam];

    for (int i = 0; i < tam; i++){
        cout << "Introduce el nombre del Garaje "<<i+1<<":"<<endl;
        getline(cin >> ws, garajes[i].nombre);
        cout << "Introduce la capacidad total de "<<garajes[i].nombre<<":"<<endl;
        cin >> garajes[i].capacidad;
        cout << "Introduce la ocupacion actual de "<<garajes[i].nombre<<" (no puede ser mayor que la capacidad):"<<endl;
        do{
            cout << ">";
            cin >> garajes[i].ocupacion;
        } while (garajes[i].ocupacion > garajes[i].capacidad);
    }

    cout << "\nCuantos coches quieres introducir?" << endl;
    cout << ">";
    cin >> coches;

    getch();

    Estrategia1(garajes, tam, coches);

}

