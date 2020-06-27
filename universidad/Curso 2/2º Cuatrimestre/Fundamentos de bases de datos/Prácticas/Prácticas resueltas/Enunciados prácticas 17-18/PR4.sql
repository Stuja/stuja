/*1*/
INSERT INTO sesion(
SELECT cn,ce,0,'10/04/2011'
FROM sesion s
WHERE fecha='17/02/11');

/*(Para mostrar que se ha insertado correctamente)*/
SELECT *
FROM sesion;

/*2*/
UPDATE sesion
SET tiempo= (SELECT AVG(t_max)-100 "Media de tiempos maximos"
            FROM entreno
            WHERE estilo='LIB')
WHERE ce IN (SELECT ce 
            FROM entreno
            WHERE estilo='LIB');

/*(Para mostrar las sesiones con estilo libre)*/         
SELECT s.cn,s.ce,tiempo,fecha
FROM entreno e, sesion s
WHERE e.ce=s.ce AND e.estilo='LIB';

/*(Para mostrar los entrenos con estilo libre)*/
SELECT *
FROM entreno
WHERE estilo='LIB';

/*3*/
/*(Para mostrar una lista con las sesiones con tiempos=0 y el T_MAX asociado)*/
SELECT cn,e.ce,tiempo,fecha, t_max
FROM sesion s, entreno e
WHERE tiempo=0 AND e.ce=s.ce;

UPDATE sesion s
SET tiempo= (SELECT t_max/2
            FROM entreno e
            WHERE e.ce=s.ce)
WHERE tiempo=0;


/*4*/
UPDATE entreno
SET metros=metros-metros*0.1
WHERE ce IN (SELECT ce
              FROM entreno
              WHERE metros>=200);

COMMIT;

/*5*/
DELETE FROM sesion s 
WHERE fecha>'1/03/2011' AND tiempo>(SELECT t_max/2
                                    FROM entreno e
                                    WHERE e.ce=s.ce) 
                        AND esp=null;



