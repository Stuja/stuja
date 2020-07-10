	.data 0
	
	.global x
x:	.word 1,2,3,4,  1,2,3,4,   1,2,3,4

	.text 256
;-----------------------------------------------------------------
;	AUTHOR: Manuel Alférez Ruiz
;	Número de ciclos: 84 ciclos
;	Detenciones debidas a riesgos de datos: 10
;	Detenciones debidas a riesgos de control: 2
;	Desenrrollado de bucles:
;	-Iteración 2:
;		Número de ciclos: 
;		Ganancia:
;		Eliminación de detenciones debida a riesgo de control:
;	-Iteración 3:  [VERSION ACTUAL]
;		Número de ciclos: 81 ciclos
;		Ganancia: 3 ciclos 
;		Eliminación de detenciones debida a riesgo de control: 3
;-----------------------------------------------------------------

addi	r1,r0,x
addi	r2,r0,#3

addi	r10,r0,#1
addi	r12,r0,#1

;-------------------------------------------------------

multiplicar:
lw 	r3,0(r1)
lw	r4,8(r1)
lw	r6,4(r1)
lw	r7,12(r1)
mult	r5,r3,r4
mult	r8,r6,r7
subi	r2,r2,#1
mult	r12,r12,r5
mult	r10,r10,r8
addi	r1,r1,#16
beqz	r2,fin
j	multiplicar

;-------------------------------------------------------

fin:	trap #0