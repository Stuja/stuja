#include <omp.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

typedef struct timespec timespec;

int main (int argc, char *argv[]){
	int nprocs, nthreads;
	timespec marca;
	clock_gettime(CLOCK_REALTIME,&marca);	

	nprocs=omp_get_num_procs(); //Obtenemos el número de procesadores
	nthreads=omp_get_max_threads(); //Obtenemos el número de hilos 
	printf("%ld:%ld\n", marca.tv_sec, marca.tv_nsec); //Imprimimos la marca específica de tiempo
	printf("%d procesadores\n",nprocs); //Imprimimos el número de procesadores
	printf("%d hilos\n",nthreads); //Imprimimos el número de hilos
}
