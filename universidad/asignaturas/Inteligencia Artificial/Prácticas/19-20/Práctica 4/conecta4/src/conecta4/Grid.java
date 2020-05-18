/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conecta4;

import java.awt.Color;
import javax.swing.ImageIcon;
import javax.swing.JButton;

/**
 *
 * @author José María Serrano
 * @version 1.5 Departamento de Informática. Universidad de Jáen
 *
 * Inteligencia Artificial. 2º Curso. Grado en Ingeniería Informática
 *
 * Clase Grid para representar un tablero de juego
 *
 */
public class Grid {

    // Representación del tablero
    // array de botones para la GUI
    private final JButton boton[][];
    // array de enteros
    private final int boton_int[][];

    // Iconos
    private final ImageIcon foto1;
    private final ImageIcon foto2;

    // Número de columnas (x)
    private final int columnas;
    // Número de filas (y)
    private final int filas;

    // Constructor
    public Grid(int filas, int columnas, String pic1, String pic2) {

        //Cargar imagenes
        foto1 = new ImageIcon(pic1);
        foto2 = new ImageIcon(pic2);

        this.filas = filas;
        this.columnas = columnas;

        // inicializar tablero
        boton = new JButton[filas][columnas];
        boton_int = new int[filas][columnas];
    } // Grid

    // Comprobar si el tablero se halla en un estado de fin de partida,
    // a partir de la última jugada realizada
    public int checkWin(int x, int y, int conecta) {
        /*
		 *	x fila
		 *	y columna
         */

        //Comprobar vertical
        int ganar1 = 0;
        int ganar2 = 0;
        int ganador = 0;
        boolean salir = false;
        for (int i = 0; (i < filas) && !salir; i++) {
            if (boton_int[i][y] != Conecta4.VACIO) {
                if (boton_int[i][y] == Conecta4.PLAYER1) {
                    ganar1++;
                } else {
                    ganar1 = 0;
                }
                // Gana el jugador 1
                if (ganar1 == conecta) {
                    ganador = Conecta4.PLAYER1;
                    salir = true;
                }
                if (!salir) {
                    if (boton_int[i][y] == Conecta4.PLAYER2) {
                        ganar2++;
                    } else {
                        ganar2 = 0;
                    }
                    // Gana el jugador 2
                    if (ganar2 == conecta) {
                        ganador = Conecta4.PLAYER2;
                        salir = true;
                    }
                }
            } else {
                ganar1 = 0;
                ganar2 = 0;
            }
        }
        // Comprobar horizontal
        ganar1 = 0;
        ganar2 = 0;
        for (int j = 0; (j < columnas) && !salir; j++) {
            if (boton_int[x][j] != Conecta4.VACIO) {
                if (boton_int[x][j] == Conecta4.PLAYER1) {
                    ganar1++;
                } else {
                    ganar1 = 0;
                }
                // Gana el jugador 1
                if (ganar1 == conecta) {
                    ganador = Conecta4.PLAYER1;
                    salir = true;
                }
                if (ganador != Conecta4.PLAYER1) {
                    if (boton_int[x][j] == Conecta4.PLAYER2) {
                        ganar2++;
                    } else {
                        ganar2 = 0;
                    }
                    // Gana el jugador 2
                    if (ganar2 == conecta) {
                        ganador = Conecta4.PLAYER2;
                        salir = true;
                    }
                }
            } else {
                ganar1 = 0;
                ganar2 = 0;
            }
        }
        // Comprobar oblicuo. De izquierda a derecha
        ganar1 = 0;
        ganar2 = 0;
        int a = x;
        int b = y;
        while (b > 0 && a > 0) {
            a--;
            b--;
        }
        while (b < columnas && a < filas && !salir) {
            if (boton_int[a][b] != Conecta4.VACIO) {
                if (boton_int[a][b] == Conecta4.PLAYER1) {
                    ganar1++;
                } else {
                    ganar1 = 0;
                }
                // Gana el jugador 1
                if (ganar1 == conecta) {
                    ganador = Conecta4.PLAYER1;
                    salir = true;
                }
                if (ganador != Conecta4.PLAYER1) {
                    if (boton_int[a][b] == Conecta4.PLAYER2) {
                        ganar2++;
                    } else {
                        ganar2 = 0;
                    }
                    // Gana el jugador 2
                    if (ganar2 == conecta) {
                        ganador = Conecta4.PLAYER2;
                        salir = true;
                    }
                }
            } else {
                ganar1 = 0;
                ganar2 = 0;
            }
            a++;
            b++;
        }
        // Comprobar oblicuo de derecha a izquierda 
        ganar1 = 0;
        ganar2 = 0;
        a = x;
        b = y;
        //buscar posición de la esquina
        while (b < columnas - 1 && a > 0) {
            a--;
            b++;
        }
        while (b > -1 && a < filas && !salir) {
            if (boton_int[a][b] != Conecta4.VACIO) {
                if (boton_int[a][b] == Conecta4.PLAYER1) {
                    ganar1++;
                } else {
                    ganar1 = 0;
                }
                // Gana el jugador 1
                if (ganar1 == conecta) {
                    ganador = Conecta4.PLAYER1;
                    salir = true;
                }
                if (ganador != Conecta4.PLAYER1) {
                    if (boton_int[a][b] == Conecta4.PLAYER2) {
                        ganar2++;
                    } else {
                        ganar2 = 0;
                    }
                    // Gana el jugador 2
                    if (ganar2 == conecta) {
                        ganador = Conecta4.PLAYER2;
                        salir = true;
                    }
                }
            } else {
                ganar1 = 0;
                ganar2 = 0;
            }
            a++;
            b--;
        }

        return ganador;
    } // checkWin

    // Comprobar si una columna está completa
    public boolean fullColumn(int col) {
        int y = getFilas() - 1;
        //Ir a la última posición de la columna	
        while ((y >= 0) && (getButton(y, col) != 0)) {
            y--;
        }

        // Si y < 0, columna completa
        return (y < 0);

    } // fullColumn

    // Devuelve la casilla en la posición <x,y>
    public int getButton(int y, int x) {
        if (y >= 0 && y < filas && x >= 0 && x < columnas) {
            return boton_int[y][x];
        } else // error: fuera de rango
        {
            return -2;
        }
    }

    // Devuelve el número de columnas del tablero de juego
    public int getColumnas() {
        return columnas;
    }

    // Ficha del jugador 1
    public ImageIcon getFicha1() {
        return foto1;
    }

    // Ficha del jugador 2
    public ImageIcon getFicha2() {
        return foto2;
    }

    // Devuelve el número de filas del tablero de juego
    public int getFilas() {
        return filas;
    }

    // Devuelve la casilla en la posición <x,y>
    public JButton getJButton(int y, int x) {
        if (y >= 0 && y < filas && x >= 0 && x < columnas) {
            return boton[y][x];
        } else // error: fuera de rango
        {
            return null;
        }
    }

    // Inicialización de un tablero vacío
    public void initialize(int i, int j, java.awt.event.ActionListener principal, Color col) {
        boton[i][j] = new JButton();
        boton[i][j].addActionListener(principal);
        boton[i][j].setBackground(col);
        boton_int[i][j] = 0;
    }

    // Método para mostrar el estado actual del tablero por la salida estándar
    public void print() {
        //System.out.println("Conecta-N:");
        for (int i = 0; i < filas; i++) {
            for (int j = 0; j < columnas; j++) {
                System.out.print(boton_int[i][j] + " ");
            }
            System.out.println();
        }
        System.out.println();
    }

    // Coloca una ficha en la columna col
    public int setButton(int col, int jugador) {

        int y = getFilas() - 1;
        //Ir a la última posición de la columna	
        while ((y >= 0) && (getButton(y, col) != 0)) {
            y--;
        }

        // Si la columna no está llena, colocar la ficha
        if (y >= 0) {
            switch (jugador) {
                case Conecta4.PLAYER1:
                    boton[y][col].setIcon(foto1); // Jugador 1
                    boton_int[y][col] = 1;
                    break;
                case Conecta4.PLAYER2:
                    boton[y][col].setIcon(foto2); // Jugador 2
                    boton_int[y][col] = -1;
                    break;
            } // switch
        } // if

        return y;

    } // setButton

    // Reiniciar el tablero a vacío.
    public void reset() {
        for (int i = 0; i < filas; i++) {
            for (int j = 0; j < columnas; j++) {
                boton[i][j].setIcon(null);
                boton_int[i][j] = 0;
            }
        }
    }

    // Devuelve el array de enteros con el tablero actual
    public int[][] toArray() {
        return boton_int;
    }

    // Devuelve el color de la primera ficha de la columna
    public int topColumn(int col) {
        int y = getFilas() - 1;
        //Ir a la última posición de la columna	
        while ((y >= 0) && (getButton(y, col) != 0)) {
            y--;
        }

        if (y < 0) {
            return -2; // Error: La columna está completa
        } else {
            return getButton(y, col);
        }

    } // fullColumn

} // Grid
