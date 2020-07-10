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
;	-Iteración 2: [VERSION ACTUAL]
;		Número de ciclos: 75 ciclos 
;		Ganancia: 9 ciclos
;		Eliminación de detenciones debida a riesgo de control: 2
;	-Iteración 3: 
;		Número de ciclos: 
;		Ganancia:
;		Eliminación de detenciones debida a riesgo de control:
;-----------------------------------------------------------------

addi	r1,r0,x
addi	r11,r0,#2
addi	r10,r0,#1
addi	r12,r0,#1

;-------------------------------------------------------

bucle:
lw	r2,0(r1)
lw	r3,8(r1)
lw	r4,16(r1)
mult	r8,r2,r3
lw	r5,4(r1)
lw	r6,12(r1)
lw	r7,20(r1)
mult	r9,r5,r6
mult	r8,r8,r4
mult	r9,r9,r7
subi	r11,r11,#1
addi	r1,r1,#24
mult	r10,r10,r9
mult	r12,r12,r8
beqz	r11,fin
j	bucle

;-------------------------------------------------------

fin:	trap #0