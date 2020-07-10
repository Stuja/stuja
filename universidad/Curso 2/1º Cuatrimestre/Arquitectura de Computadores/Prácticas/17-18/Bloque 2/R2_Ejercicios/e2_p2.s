	.data 0

	.global x 
x: 	.word 1,2,3,4,5,6,7,8

	.text 256 

;----------------------------------------------------------------------------------------
;	AUTHOR: Manuel Alférez Ruiz
;
;	Calcular multiplicación de los números que ocupan posiciones par e impares
;	Número de ciclos: 39 ciclos
;	Eliminar detenciones (reordenando instrucciones) y considerar bypass:
;		-Número de ciclos: 40 ciclos
;	Informe:
;		-Detenciones debidas a riesgo de datos: 0
;		-Detenciones debiadas a riesgos estructurales: 16
;		-Informe de eliminación de detenciones: 
;----------------------------------------------------------------------------------------

addi 	r1,r0,x

;-----------------------------------------------------------------------------

;Cargo los impares y los multiplico
lw	r2,0(r1)
lw 	r3,8(r1)
lw	r5,16(r1)
lw	r6,24(r1)
mult	r4,r2,r3

;-----------------------------------------------------------------------------

;Cargo los pares y los multiplico
lw 	r8,4(r1)
lw	r9,12(r1)
lw	r14,20(r1)
mult	r7,r5,r6
lw	r15,28(r1)
mult	r13,r8,r9
mult	r16,r14,r15

;Obtengo los resultados de las multiplicaciones
mult	r12,r4,r7
mult	r10,r13,r16


;-----------------------------------------------------------------------------

trap #0