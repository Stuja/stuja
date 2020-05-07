/*1*/
SELECT *
FROM entreno;

/*2*/
SELECT sexo, nombre
FROM nadador
ORDER BY 1 DESC, 2 ASC;

/*3*/
SELECT DISTINCT fecha
FROM sesion;

/*4*/
SELECT TO_CHAR(fecha,'dd-mon-yyyy')"Fecha", tiempo
FROM sesion
ORDER BY fecha DESC;

/*5*/
SELECT ce, t_max, t_max+t_max*0.1 "Aumento de t_max"
FROM entreno;

/*6*/
SELECT * 
FROM nadador
WHERE nombre LIKE 'A%' OR sexo='F';

/*7*/
SELECT *
FROM nadador 
WHERE esp IS NULL;

/*8*/
SELECT s.cn, ce, tiempo, fecha, nombre, esp
FROM sesion s, nadador n
WHERE s.cn=n.cn;

/*9*/
SELECT DISTINCT nombre, metros, t_max, tiempo
FROM nadador n, entreno e, sesion s
WHERE n.cn=s.cn AND s.ce=e.ce AND estilo='LIB';

/*10*/
SELECT e1.estilo, e2.estilo, e1.metros
FROM entreno e1, entreno e2
WHERE e1.metros=e2.metros AND e1.estilo<e2.estilo;
