/*
 * File:   Fecha.cpp
 * Author: Windows
 *
 * Created on 20 de febrero de 2018, 12:44
 */

#include "Fecha.h"
#include <ctime>

 /**
  * @brief Constructor por defecto de Fecha
  */
Fecha::Fecha()
{
	time_t t = time(0); //obtiene la fecha y hora actual
	struct tm* hoy = localtime(&t);

	dia = hoy->tm_mday;
	mes = hoy->tm_mon + 1;
	anio = hoy->tm_year + 1900;
}


Fecha::Fecha(int dia, int mes, int anio) :
	dia(dia),
	mes(mes),
	anio(anio)
{}

Fecha::Fecha(const Fecha &orig) :
	dia(orig.dia),
	mes(orig.mes),
	anio(orig.anio)
{}


int Fecha::GetAnio() {
	return anio;
}

void Fecha::SetAnio(int anio) {
	this->anio = anio;
}

int Fecha::GetDia() {
	return dia;
}

void Fecha::SetDia(int dia) {
	this->dia = dia;
}

int Fecha::GetMes() {
	return mes;
}

void Fecha::SetMes(int mes) {
	this->mes = mes;
}

//Operadores

bool Fecha::operator==(const Fecha& fecha) {
	if (dia == fecha.dia && mes == fecha.mes && anio == fecha.anio)
		return true;
	else
		return false;
}

bool Fecha::operator<(const Fecha &fecha) {
	if (anio < fecha.anio)
		return true;
	else if (mes < fecha.mes)
		return true;
	else if (dia <= fecha.dia)
		return true;
	else
		return false;
}

bool Fecha::operator>(const Fecha &fecha) {
	if (!(*this < fecha) && !(*this == fecha))
		return true;
	else
		return false;
}

bool Fecha::operator!=(const Fecha &fecha) {
	if (!(*this == fecha))
		return true;
	else
		return false;
}

bool Fecha::operator<=(const Fecha &fecha) {
	if ((*this < fecha) || (*this == fecha))
		return true;
	else
		return false;
}

bool Fecha::operator>=(const Fecha &fecha) {
	if ((*this > fecha) || (*this == fecha))
		return true;
	else
		return false;
}