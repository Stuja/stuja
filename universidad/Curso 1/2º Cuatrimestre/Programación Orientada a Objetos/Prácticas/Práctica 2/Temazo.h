/* 
 * @file Temazo.h
 * @author Delunado
 * @brief Cabezera de la clase Temazo
 *
 * Created on 18 de febrero de 2018, 18:03
 */


#ifndef TEMAZO_H
#define TEMAZO_H

using namespace std;
#include<iostream>
#include<string>
#include"Fecha.h"


class Temazo{
private:
    string titulo;
    string interprete;
    int segundos;
    int puntuacion;
    string nombreUltimoGarito;
    Fecha ultimaFecha;
    
public:
    //Temazo();
    Temazo(string titulo = "Titulo por defecto", string interprete = "Interprete por defecto", int segundos = 20, int puntuacion = 0, string nombreUltimoGarito = "Nombre por defecto de ultimo garito", Fecha ultimaFecha = Fecha());
    Temazo(const Temazo& orig);
    ~Temazo();
    string GetTitulo();
    SetTitulo(string titulo);
    string GetInterprete();
    SetInterprete(string interprete);
    GetSegundos();
    SetSegundos(int segundos);
    GetPuntuacion();
    string GetNombreUltimoGarito();
    void SetNombreUltimoGarito(string nombreUltimoGarito);
    Fecha GetUltimaFecha();
    void SetUltimaFecha(Fecha ultimaFecha);
    
    bool operator<(Temazo & otro){
        if (this->segundos < otro.segundos)
            return true;
        else
            return false;
    }
};

#endif /* TEMAZO_H */

