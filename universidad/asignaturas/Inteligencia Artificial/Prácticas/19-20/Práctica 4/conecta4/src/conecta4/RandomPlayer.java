/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conecta4;

/**
 *
 * @author José María Serrano
 * @version 1.5 Departamento de Informática. Universidad de Jáen
 *
 * Inteligencia Artificial. 2º Curso. Grado en Ingeniería Informática
 *
 * Clase RandomPlayer para representar al jugador CPU que juega al azar
 *
 */
public class RandomPlayer extends Player {

    // Método para determinar, de forma muy básica, donde colocar la siguiente ficha
    // No es especialmente brillante
    /**
     *
     * @param tablero Representación del tablero de juego
     * @param conecta Número de fichas consecutivas para ganar
     * @return Jugador ganador (si lo hay)
     */
    @Override
    public int turnoJugada(Grid tablero, int conecta) {

        boolean cubrir_izquierda = false;
        int ganarVert = 0;
        int ganarHorz = 0;
        // Generar columna aleatoria por defecto
        int posicion;

        //Ataque en horizontal
        for (int i = 0; i < tablero.getFilas(); i++) {
            //buscamos en todo el tablero
            for (int j = 0; j < tablero.getColumnas(); j++) {
                if (tablero.getButton(i, j) != Conecta4.VACIO) {
                    if (tablero.getButton(i, j) == Conecta4.PLAYER2) {
                        ganarHorz++;
                    } else {
                        ganarHorz = 0;
                    }
                    if (ganarHorz == conecta - 1) {
                        posicion = j;
                        if (posicion != tablero.getColumnas() - 1) {
                            if (!tablero.fullColumn(j + 1)) {
                                posicion++;
                            } else if (j >= conecta - 1 && !tablero.fullColumn(j - (conecta - 1))) {
                                posicion = posicion - (conecta - 1);
                            }
                        }
                    }
                }
            }
            ganarHorz = 0;
        }
        // Defenderse en Horizontal hacia la izquierda
        ganarHorz = 0;
        for (int j = tablero.getColumnas() - 1; j >= 0; j--) {
            if (!tablero.fullColumn(j)) {
                if (tablero.topColumn(j) != Conecta4.PLAYER2) {
                    ganarHorz++;
                } else {
                    ganarHorz = 0;
                }
                if (ganarHorz == conecta - 1 && j != 0) {
                    posicion = j;
                    if (!tablero.fullColumn(j - 1)) {
                        posicion--;
                        cubrir_izquierda = true;
                    }
                }
            }
        }
        // Defenderse en Horizontal hacia la derecha
        ganarHorz = 0;
        if (!cubrir_izquierda) {
            for (int j = 0; j < tablero.getColumnas(); j++) {
                if (!tablero.fullColumn(j)) {
                    if (tablero.topColumn(j) != Conecta4.PLAYER2) {
                        ganarHorz++;
                    } else {
                        ganarHorz = 0;
                    }
                    if (ganarHorz == conecta - 1) {
                        posicion = j;
                        if (posicion != tablero.getColumnas() - 1) {
                            if (!tablero.fullColumn(j + 1)) {
                                posicion++;
                            }
                        }
                    }
                }
            }
        }
        // Defenderse en Vertical
        posicion = getRandomColumn(tablero);
        for (int i = 0; i < tablero.getFilas(); i++) {
            if (tablero.getButton(i, posicion) != Conecta4.VACIO) {
                if (tablero.getButton(i, posicion) != Conecta4.PLAYER2) {
                    ganarVert++;
                } else {
                    ganarVert = 0;
                }
                if (ganarVert != conecta - 1) {
                    posicion = getRandomColumn(tablero); //obtiene la columna en la que se puede ganar;
                }
            }
        }
        // Ataque en Vertical
        ganarVert = 0;
        for (int i = 0; i < tablero.getFilas(); i++) //buscamos en todo el tablero
        {
            for (int j = 0; j < tablero.getColumnas(); j++) {
                if (tablero.getButton(i, j) != Conecta4.VACIO) {
                    if (tablero.getButton(i, j) == Conecta4.PLAYER2) {
                        ganarVert++;
                    } else {
                        ganarVert = 0;
                    }
                    if (ganarVert == conecta - 1 && j != 0) //si en alguna columna hay n-1 fichas seguidas de la mAquina
                    {
                        posicion = j; //obtiene la columna en la que se puede ganar;
                    }
                }
            }
            ganarVert = 0;
        }

        if (tablero.fullColumn(posicion)) //si no se pude poner ficha en la columna (columna llena)
        {
            posicion = getRandomColumn(tablero); //Genera posición aleatoria
        }

        //Pintar Ficha
        return tablero.checkWin(tablero.setButton(posicion, Conecta4.PLAYER2), posicion, conecta);
    } // turnoJugada          

} // RandomPlayer
