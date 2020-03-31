/*1*/
SELECT AVG(tiempo) "Tiempo Medio", SUM(tiempo) "Total tiempo"
FROM sesion
WHERE fecha='17-feb-2011';

/*2*/
SELECT estilo "EST", COUNT(ce) "Num. Entrenamientos"
FROM entreno 
GROUP BY estilo
ORDER BY 1 ASC;

/*3*/
SELECT estilo "EST", SUM(metros) "Total metros"
FROM entreno e, sesion s
WHERE e.ce=s.ce
GROUP BY estilo
ORDER BY 2 ASC;

/*4*/
SELECT nombre, SUM(metros)
FROM nadador n, entreno e, sesion s
WHERE n.cn=s.cn AND s.ce=e.ce 
HAVING SUM(metros)>100
GROUP BY nombre
ORDER BY 1 ASC;

/*5*/
SELECT n.cn "Nadador", s.fecha "FECHA"
FROM nadador n, sesion s
WHERE s.fecha IN (SELECT fecha
                FROM sesion 
                WHERE cn=333) AND n.cn=s.cn AND n.cn<>333
ORDER BY 1,2;

/*6*/
SELECT nombre "NOMBRE", SUM(metros) "Total metros"
FROM nadador n, entreno e, sesion s
WHERE n.cn= s.cn AND s.ce= e.ce
GROUP BY nombre
HAVING SUM(metros)=(SELECT MAX(SUM(metros))
                    FROM nadador n, entreno e, sesion s
                    WHERE n.cn= s.cn AND s.ce= e.ce
                    GROUP BY nombre);

/*7 Los nombres de los nombres que han hecho mas de 100 metros*/
SELECT nombre 
FROM nadador n
WHERE 100<(SELECT sum(metros)
           FROM sesion s, entreno e 
           WHERE s.ce=e.ce AND s.cn=n.cn);

/*8*/
INSERT INTO sesion VALUES(111,'L05',40,'18-3-2011');
INSERT INTO sesion VALUES(222,'L05',42,'18-3-2011');

/*8.1*/
SELECT DISTINCT n1.nombre "NOMBRE", n2.nombre "NOMBRE"
FROM nadador n1, nadador n2
WHERE (SELECT SUM(metros)
      FROM nadador n, entreno e, sesion s
      WHERE e.ce=s.ce AND n.cn=s.cn AND n.cn=n1.cn) = (SELECT SUM(metros)
                                                       FROM nadador n, entreno e, sesion s
                                                       WHERE e.ce=s.ce AND n.cn=s.cn AND n.cn=n2.cn) AND n1.nombre<n2.nombre;

/*9*/
/*Si deseamos que aparezcan sola mente una vez aquellos que son inversos, es decir, 
si aparece L20-L05 y despues L05-L20 lo que hay que hacer es decir que eligan
los que son menores estrictos. En este caso que el codigo de entreno sea distinto*/
INSERT INTO entreno VALUES('L20','LIB',200,420);

SELECT e1.ce, e2.ce
FROM entreno e1, entreno e2
WHERE e1.estilo=e2.estilo AND e1.ce<e2.ce;

/*10*/
INSERT INTO sesion VALUES(222,'M10',81,'18-3-2011');

/*El not exits seria: EXISTS(vacio)-> falso pues not exists verdadero 
es decir, si es el conjunto vacia verdadero*/
SELECT n1.cn
FROM nadador n1
WHERE   NOT EXISTS(  (SELECT DISTINCT estilo
                       FROM entreno)
                       MINUS
                      (SELECT estilo
                       FROM entreno e1, sesion s1
                      WHERE s1.cn=n1.cn AND s1.ce=e1.ce));
               
/*11*/

SELECT n1.nombre
FROM nadador n1
WHERE NOT EXISTS( (SELECT DISTINCT estilo
                 FROM entreno
                 WHERE estilo='LIB') 
                 MINUS 
                 (SELECT estilo
                   FROM entreno e1, sesion s1
                   WHERE s1.cn=n1.cn AND s1.ce=e1.ce));


/*12*/
SELECT * 
FROM nadador 
ORDER BY 1;

SELECT *
FROM entreno 
ORDER BY 1;

SELECT * 
FROM sesion 
ORDER BY 1,2,3,4;
