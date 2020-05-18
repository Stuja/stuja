/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package conecta4;

/**
 *
 * @author José María Serrano
 * @version 1.4 Departamento de Informática. Universidad de Jáen
 *
 * Inteligencia Artificial. 2º Curso. Grado en Ingeniería Informática
 *
 * Curso 2016-17: Primera versión, Conecta-N Curso 2017-18: Se introducen
 * obstáculos aleatorios Curso 2018-19: Conecta-4
 *
 * Código original: * Lenin Palafox * http://www.leninpalafox.com
 */
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Conecta4 extends JFrame implements ActionListener {

    // Número de turnos/movimientos
    private int movimiento = 0;
    // Turno (empieza jugador 1)
    private boolean turnoJ1 = true;
    // Jugador 2, CPU por defecto
    private boolean jugadorcpu = true;
    // Jugador 2, CPU aleatorio por defecto
    private boolean iaplayer = false;
    // Marca si el jugador pulsa sobre el tablero
    private boolean pulsado;

    // Jugadores
    public static final int PLAYER1 = 1;
    public static final int PLAYER2 = -1;
    //public static final int JUGADOR0 = 2;
    public static final int VACIO = 0;

    // Parámetros
    // Número de filas
    private static final int FILAS = 6;
    // Número de columnas
    private static final int COLUMNAS = 7;
    // Número de fichas que han de alinearse para ganar
    private static final int CONECTA = 4;

    // Tablero de juego
    private Grid juego;
    //jugadores
    private Player player2;

    //menus y elementos de la GUI
    private final JMenuBar barra = new JMenuBar();
    private final JMenu archivo = new JMenu("Archivo");
    private final JMenu opciones = new JMenu("Opciones");
    private final JMenuItem salir = new JMenuItem("Salir");
    private final JRadioButton p1h = new JRadioButton("Humano", true);
    private final JRadioButton p2h = new JRadioButton("Humano", false);
    private final JRadioButton p2c = new JRadioButton("CPU (Random)", true);
    private final JRadioButton p2c2 = new JRadioButton("CPU (IA)", false);
    // Leyendas y cabeceras
    private String cabecera = "Pr\u00e1cticas de IA (Curso 2019-20)";
    private final JLabel nombre = new JLabel(cabecera, JLabel.CENTER);
    private final String title = "Conecta-4 - UJA 2019-20";

    /**
     * Gestión de eventos y del transcurso de la partida
     *
     * @param ae
     */
    @Override
    public void actionPerformed(ActionEvent ae) {
        // Eventos del menú Opciones
        if (ae.getSource() == p2h) {
            jugadorcpu = false; // Humano
            reset();
        }
        if (ae.getSource() == p2c) {
            jugadorcpu = true; // CPU Random
            iaplayer = false;
            reset();
        }
        if (ae.getSource() == p2c2) {
            jugadorcpu = true; // CPU IA;
            iaplayer = true;
            reset();
        }
        if (ae.getSource() == salir) {
            dispose();
            System.exit(0);
        }

        // Control del juego por el usuario
        int x;
        // Siempre empieza el jugador 1
        for (int i = 0; i < FILAS; i++) {
            for (int j = 0; j < COLUMNAS; j++) {
                if (ae.getSource() == juego.getJButton(i, j)) {
                    if (turnoJ1) {
                        x = juego.setButton(j, PLAYER1);
                    } else {
                        x = juego.setButton(j, PLAYER2);
                    }
                    // Comprobar si la jugada es válida
                    if (!(x < 0)) {
                        if (jugadorcpu) //Si es modo un jugador o dos
                        {
                            pulsado = true;
                        }
                        turnoJ1 = !turnoJ1;
                        movimiento++;
                        // Comprobar si acabó el juego
                        finJuego(juego.checkWin(x, j, CONECTA));

                    } // En otro caso, la columna ya está completa
                } // if
            } // for 2
        } // for 1       

        // Pasa el turno al jugador 2
        if (pulsado) {
            if (jugadorcpu) {
                pulsado = false;
                turnoJ1 = !turnoJ1;
                movimiento++;
                // Comprobar si acabó el juego
                finJuego(player2.turnoJugada(juego, CONECTA));
            }
        }
        // Mostrar tablero tras cada movimiento
        juego.print();
        cabecera = "Movimientos: " + movimiento + " - Turno: ";
        if (turnoJ1) {
            cabecera += "Player 1";
        } else {
            cabecera += "Player 2";
        }
        nombre.setText(cabecera);

    } // actionPerformed         

    public void finJuego(int ganador) {
        // Comprobamos si llegamos al final del juego
        // Empate!!!
        if (movimiento >= FILAS * COLUMNAS) {
            JOptionPane.showMessageDialog(this, "¡Empate!", "Conecta-4", JOptionPane.INFORMATION_MESSAGE);
            reset();
        }
        switch (ganador) {
            case PLAYER1:
                JOptionPane.showMessageDialog(this, "Winner, Jugador 1\nen " + movimiento + " movimientos!", "Conecta-4", JOptionPane.INFORMATION_MESSAGE, juego.getFicha1());
                System.out.println("Winner: Jugador 1, en " + movimiento + " movimientos.");
                reset();
                break;
            case PLAYER2:
                JOptionPane.showMessageDialog(this, "Winner, Jugador 2\nen " + movimiento + " movimientos!", "Conecta-4", JOptionPane.INFORMATION_MESSAGE, juego.getFicha2());
                System.out.println("Winner: Jugador 2, en " + movimiento + " movimientos.");
                reset();
                break;
        }

    } // finJuego

    /**
     * Reinicia una partida
     */
    private void reset() {
        // Volver el programa al estado inicial	
        juego.reset();
        turnoJ1 = true;
        movimiento = 0;
        pulsado = false;

        System.out.println();
        System.out.println("Nueva partida:");
        System.out.println("Player 1: Humano");
        System.out.print("Player 2: ");
        if (jugadorcpu) {
            if (iaplayer) {
                player2 = new IAPlayer();
                System.out.println("CPU (IA)");
            } else {
                player2 = new RandomPlayer();
                System.out.println("CPU (Random)");
            }
        } else {
            player2 = null;
            System.out.println("Humano");
        }
    } // reset

    /**
     * Configuración inicial
     *
     * Creación de la interfaz gráfica del juego
     */
    private void run() {

        juego = new Grid(FILAS, COLUMNAS, "assets/player1.png", "assets/player2.png");
        int altoVentana = (FILAS + 1) * juego.getFicha1().getIconWidth();
        int anchoVentana = COLUMNAS * juego.getFicha1().getIconWidth();

        if (iaplayer) {
            player2 = new IAPlayer();
        } else {
            player2 = new RandomPlayer();
        }

        //menu GUI
        salir.addActionListener(this);
        archivo.add(salir);
        // Player 1
        opciones.add(new JLabel("Player 1:"));
        ButtonGroup m1Jugador = new ButtonGroup();
        m1Jugador.add(p1h);
        // Player 2
        opciones.add(p1h);
        opciones.add(new JLabel("Player 2:"));
        p2h.addActionListener(this);
        p2c.addActionListener(this);
        p2c2.addActionListener(this);
        ButtonGroup m2Jugador = new ButtonGroup();
        m2Jugador.add(p2h);
        m2Jugador.add(p2c);
        m2Jugador.add(p2c2);
        opciones.add(p2h);
        opciones.add(p2c);
        opciones.add(p2c2);

        barra.add(archivo);
        barra.add(opciones);
        setJMenuBar(barra);

        //Panel Principal 
        JPanel principal = new JPanel();
        principal.setLayout(new GridLayout(FILAS, COLUMNAS));

        //Colocar Botones
        for (int i = 0; i < FILAS; i++) {
            for (int j = 0; j < COLUMNAS; j++) {
                juego.initialize(i, j, this, Color.BLACK);
                principal.add(juego.getJButton(i, j));
            }
        }
        nombre.setForeground(Color.BLUE);
        add(nombre, "North");
        add(principal, "Center");

        //Para cerrar la Ventana
        addWindowListener(new WindowAdapter() {
            @Override
            public void windowClosing(WindowEvent we) {
                dispose();
                System.exit(0);
            }
        });

        //tamaño frame
        setLocation(170, 25);
        setSize(anchoVentana, altoVentana);
        setResizable(false);
        setTitle(title);
        setVisible(true);
    } // run

    /**
     * Método principal
     *
     * Lectura de parámetros desde línea de comandos e inicio del programa
     *
     * @param args
     */
    public static void main(String[] args) {
        System.out.println("Conecta4 - 4 en Raya");
        System.out.println("-----------------------------------------");
        System.out.println("Inteligencia Artificial - Curso 2019-20");
        
        System.out.println();
        System.out.println("Nueva partida.");
        System.out.println("Tama\u00f1o del tablero: " + FILAS + " filas x " + COLUMNAS + " columnas.");
        System.out.println("Conecta " + CONECTA + " fichas en raya para ganar.");
        System.out.println();
        System.out.println("Estado inicial:");
        System.out.println("Player 1: Humano");
        System.out.println("Player 2: CPU (Random)");

        Conecta4 juego = new Conecta4();
        juego.run();

    } // main

} // Conecta4
