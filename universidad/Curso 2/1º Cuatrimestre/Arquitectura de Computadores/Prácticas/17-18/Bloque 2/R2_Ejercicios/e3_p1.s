	.data 0
	
	.global x
x: 	.double 5,9,13, 6,10,14, 7,11,15, 8,12,16

	.text 256

;-----------------------------------------------------------------
;	AUTHOR: Manuel Alférez Ruiz
;
;	Sumar columnas de matriz de double
;	Número de ciclos: 131 ciclos
;	Eliminar detenciones (reordenando instrucciones) y considerar bypass:
;		-Número de ciclos:
;	Informe:
;		-Detenciones debidas a riesgo de datos:
;		-Detenciones debiadas a riesgos estructurales:
;		-Informe de eliminación de detenciones:
;-----------------------------------------------------------------

addi	r1,r0,x		;R1=Puntero
addi 	r2,r0,#3	;R2=Contador

;------------------------------------------

suma_col1:
ld	f0,0(r1)
addd	f10,f10,f0
addi	r1,r1,#8
subi	r2,r2,#1
beqz	r2,inicializar1
j	suma_col1

;------------------------------------------

inicializar1: 
addi	r2,r0,#3
j	suma_col2

suma_col2:
ld	f0,0(r1)
addd	f12,f12,f0
addi	r1,r1,#8
subi	r2,r2,#1
beqz	r2,inicializar2
j	suma_col2

;------------------------------------------


inicializar2: 
addi	r2,r0,#3
j	suma_col3

suma_col3:
ld	f0,0(r1)
addd	f14,f14,f0
addi	r1,r1,#8
subi	r2,r2,#1
beqz	r2,inicializar3
j	suma_col3

;------------------------------------------

inicializar3: 
addi	r2,r0,#3
j	suma_col4

suma_col4:
ld	f0,0(r1)
addd	f16,f16,f0
addi	r1,r1,#8
subi	r2,r2,#1
beqz	r2,fin
j	suma_col4

;------------------------------------------

fin: 	trap #0