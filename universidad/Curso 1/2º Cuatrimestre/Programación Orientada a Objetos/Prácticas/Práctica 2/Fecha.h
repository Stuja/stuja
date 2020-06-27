/* 
 * @file Fecha.h
 * @author Delunado
 * @brief Clase Fecha
 *
 * Created on 20 de febrero de 2018, 12:44
 */

#ifndef FECHA_H
#define FECHA_H
#include <ctime>

class Fecha{
private:
    int dia;
    int mes;
    int anio;
public:
    Fecha();
    Fecha(int dia, int mes, int anio);
    Fecha(const Fecha &orig);
    
    int GetAnio();
    void SetAnio(int anio);
    
    int GetDia();
    void SetDia(int dia);
    
    int GetMes();
    void SetMes(int mes);
    
    bool operator==(const Fecha& fecha);
    
    bool operator<(const Fecha &fecha);
    
    bool operator>(const Fecha &fecha);
    
    bool operator!=(const Fecha &fecha);
    
    bool operator<=(const Fecha &fecha);
    
    bool operator>=(const Fecha &fecha);   
};



#endif /* FECHA_H */
