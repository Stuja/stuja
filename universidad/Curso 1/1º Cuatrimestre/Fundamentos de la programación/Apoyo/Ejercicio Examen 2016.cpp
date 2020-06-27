#include<iostream>
#include<stdlib.h>

using namespace std;

struct Alumno{

    string nombre;
    float nota;
    int grupo;

};

Alumno registrarAlumno(){

    Alumno p;
    cout << "Introduce el nombre del alumno: " << endl;
    getline(cin >> ws, p.nombre);

    do {
        cout << "Introduce la nota del alumno: " << endl;
        cin >> p.nota;
    } while (p.nota < 0 || p.nota > 3.5);

    do {
        cout << "Introduce el grupo de practicas del alumno: " << endl;
        cin >> p.grupo;
    } while (p.grupo < 1 || p.grupo > 8);

    return p;
}

void NotaMaxima(float *notaMax, string *nombreAlumno, Alumno vectorAlumnos[], int tam){

    *notaMax = vectorAlumnos[0].nota;

    for (int i = 1; i < tam; i++){
        if (vectorAlumnos[i].nota > *notaMax){
            *notaMax = vectorAlumnos[i].nota;
            *nombreAlumno = vectorAlumnos[i].nombre;
        }
    }
}

int NotaMedia(const Alumno vectorAlumnos[], string nombreAlumnosMedia[], int tam){

    float notaMedia = 0;
    int tamVectorMedia = 0;

    for (int i = 0; i < tam; i++){
        notaMedia += vectorAlumnos[i].nota;
    }

    notaMedia /= tam;

    for (int i = 0; i < tam; i++){
        if (vectorAlumnos[i].nota >= notaMedia){
            nombreAlumnosMedia[tamVectorMedia] = vectorAlumnos[i].nota;
            tamVectorMedia++;
        }
    }

    return tamVectorMedia;
}


int main(){
    const int TAM = 100;
    Alumno *vectorAlumnos;
    string nombresAlumnosMedia[TAM];
    int tam;

    float notaMaxima;
    string nombreAlumnoNotaMaxima;

    float notaMedia;
    int tamNombres;

    cout << "Cuantos alumnos vas a introducir?" << endl;
    cin >> tam;

    vectorAlumnos = new Alumno[tam];

    for (int i = 0; i < tam; i++){
        cout << "INTRODUCE EL ALUMNO " << i + 1 << endl;
        vectorAlumnos[i] = registrarAlumno();
    }

    NotaMaxima(&notaMaxima, &nombreAlumnoNotaMaxima, vectorAlumnos, tam);

    cout << "La nota maxima es: " << notaMaxima << endl;
    cout << "El nombre del alumno con la nota maxima es: " << nombreAlumnoNotaMaxima << endl;

    tamNombres = NotaMedia(vectorAlumnos, nombresAlumnosMedia, tam);

    for (int i = 0; i < tamNombres; i++){
        cout << nombresAlumnosMedia[i] << endl;
    }


}
