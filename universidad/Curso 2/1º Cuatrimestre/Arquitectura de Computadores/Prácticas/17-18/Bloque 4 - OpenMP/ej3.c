#include <omp.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#define M 20
#define N 20
#define P 20
#define OMP_NUM_THREADS = 4;

typedef struct timespec timespec;

    long diff(timespec inicio, timespec fin){
        return ((fin.tv_sec - inicio.tv_sec) * 1e9 + (fin.tv_nsec - inicio.tv_nsec)) / 1000;
    }

int main(int argc, char *argv[]){
    timespec inicio, fin;

    int i,j,k;
    int tid;
    int mat1[M][N];
    int mat2[N][P];
    int mat3[M][P];
    //Inicializamos la mat1
    for (i = 0; i < M; i++)
        for (j = 0; j < N; j++)
            mat1[i][j] = j + i;

    //Inicializamos la mat2
    for (i = 0; i < N; i++)
        for (j = 0; j < P; j++)
            mat2[i][j] = j + i;

    //Inicializamos la mat3
    for (i = 0; i < M; i++)
        for (j = 0; j < P; j++)
            mat3[i][j] = 0;

    clock_gettime(CLOCK_REALTIME, &inicio);
    #pragma omp parallel for shared(mat1,mat2,mat3) private(i,j,k,tid)
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            for (k = 0; k < N; k++) {
                tid=omp_get_thread_num();
                mat3[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
    }

    clock_gettime(CLOCK_REALTIME, &fin);
    printf("El tiempo con OMP es: %ld\n" , diff(inicio,fin));

    //Muestro matresultado
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            printf("%d ", mat3[i][j]);
        }
        printf("\n");
    }

    //Inicializamos la mat3
    for (i = 0; i < M; i++)
        for (j = 0; j < P; j++)
            mat3[i][j] = 0;

    #pragma omp single
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            for (k = 0; k < N; k++) {
                tid=omp_get_thread_num();
                mat3[i][j] += mat1[i][k] * mat2[k][j];
            }
        }
    }

    clock_gettime(CLOCK_REALTIME, &fin);
    printf("El tiempo sin OMP es: %ld\n" , diff(inicio,fin));

    //Muestro matresultado
    for (i = 0; i < M; i++) {
        for (j = 0; j < P; j++) {
            printf("%d ", mat3[i][j]);
        }
        printf("\n");
    }

    return 0;
}
