# Ejercicos de clases invertidas



## Lección 3

![](http://i.imgur.com/hUst0hn.png)

#### Soluciones: 

1. V

2. V

3. V

4. V

5. F, presenta un heap overflows `c<=1000`

6. F, presenta un memory leaks  `int *p ; p=new int[100]`

7. V

8. V

   

![](http://i.imgur.com/Gnbc3gr.png)

#### Soluciones:

1. 

   ```c++
   #include <iostream>
   using namespace std;
   
   int* bufferEnteros(int longitud, int val){
       int *buffer = new int[longitud];
       for (int i = 0; i < longitud; ++i) {
           buffer[i]=val;
       }
       return buffer;
   }
   
   void printBuffer(int *buffer, int size){
       for (int i = 0; i < size; ++i) {
           cout<< buffer[i] << " ";
       }
   }
   
   int main() {
       int *myBuffer = bufferEnteros(5,112);
       printBuffer(myBuffer, 5);
       return 0;
   }
   ```

   ```bash
   112 112 112 112 112 
   Process finished with exit code 0
   ```

2. 

   ```c++
   #include <iostream>
   
   using namespace std;
   
   int find(int **v, int size, int val) {
       for (int i = 0; i < size; ++i) {
           if (v[i] != nullptr) {
               if (*v[i] == val)
                   return i;
           }
       }
       return -1;
   }
   
   int **createVector(int size) {
       int **p = new int *[size];
       for (int i = 0; i < size; ++i) {
           p[i] = nullptr;
       }
       cout << "Vector creado" << endl;
       return p;
   }
   
   void deleteVector(int **v, int size) {
       for (int i = 0; i < size; ++i) {
           delete v[i];
       }
       delete[] v;
       cout << "Vector eliminado" << endl;
   }
   
   void write(int **v, int size, int pos, int val) {
       int pos_val = find(v, size, val);
       if (pos_val != -1) {
           v[pos] = v[pos_val];
           cout << "Valor referenciado" << endl;
       } else {
           if (v[pos] == nullptr) {
               v[pos] = new int;
           }
           *v[pos] = val;
           cout << "Valor creado y escrito" << endl;
       }
   }
   
   void printBuffer(int **buffer, int size) {
       for (int i = 0; i < size; ++i) {
           if (buffer[i] != nullptr)
               cout << i << ": " << *buffer[i] << " " << endl;
       }
   }
   
   int main() {
       int tam = 10;
   
       int **myBuffer = createVector(tam);
   
       write(myBuffer, tam, 0, 3);
       write(myBuffer, tam, 5, 3);
       write(myBuffer, tam, 2, 5);
   
       printBuffer(myBuffer, tam);
   
       cout << endl;
       write(myBuffer, tam, 0, 4);
       printBuffer(myBuffer, tam);
   
       deleteVector(myBuffer, tam);
   
       return 0;
   }
   ```

   ```bash
   Vector creado
   Valor creado y escrito
   Valor referenciado
   Valor creado y escrito
   0: 3 
   2: 5 
   5: 3 
   
   Valor creado y escrito
   0: 4 
   2: 5 
   5: 4 
   Vector eliminado
   
   Process finished with exit code 0
   ```



## Lección 4

![](http://i.imgur.com/43d2uwX.png)

#### Soluciones: 

1. V

2. F

3. V

4. F

   ```c++
   T& operator[](unsigned i) {return v[i]; }
   ```

5. F

6. No existe dicha pregunta. 

7. V

8. F

   ```
   tamf = tamf/2 si taml*3 < tamf
   ```



<img src="http://i.imgur.com/N6ORyhq.png" style="zoom:100%;" />



#### Soluciones:

1. 

   ```c++
   void redimensionar(int nuevoTam){
       if(tama < nuevoTam){
           int *vaux = new int[nuevoTam];
   
           for (int i = 0; i < tama; ++i) {
               vaux[i]= v[i];
           }
           delete []v;
           v = vaux;
       }
   }
   ```

2. 

   ```c++
   void aumenta(VDinamicoInt &v, int primero = -1, int ultimo = -1) {
       if (primero == -1) primero = 0;
       if (ultimo == -1) ultimo = taml;
       
       for (int i = primero; i < ultimo; ++i) 
           aumenta(v[i]);
   }
   ```

3. 

   ```c++
   class VDinamicoIntAjustado : public VDinamicoInt
   {
   public:
       void ajustar();
   };
   
   inline void VDinamicoIntAjustado::ajustar(){
       int *vaux = new int[taml];
       for (int i = 0; i < taml; ++i) {
           vaux[i]=v[i];
       }
       delete []v;
       v = vaux;
       tamf = taml;
   }
   ```



## Lección 5

![](http://i.imgur.com/8hnTOjL.png)



#### Soluciones:

1. V

2. F

   ```c++
   Matriz<T>& 
   ```

3. F

4. V

5. F

   ```
   8*8*8= 521 bytes
   ```

6. V

7. F

   ```
   500 % 8 = 4
   1 << 4 = 0001000
   ```



![](http://i.imgur.com/EF8v53a.png)



#### Soluciones:

1. 

   a)

   ```
   // Sin implementar
   ```

   b)

   ```c++
   #include <stdlib.h>
   
   class MiEstructura {
   public:
       MiEstructura(int n, int m) : {
           m = new int **[n][m];
           for (int i = 0; i < n; ++i) {
               m[i] = new int *[m];
               for (int j = 0; j < m; ++j) {
                   m[i][j] = new int;
                   *m[i][j] = rand() % 100;
               }
           }
       }
   
   private:
       int ***m;
   };
   ```

   c)

   ```
   Sin implementar
   ```

   

2. 

   

   ```c++
   template<typename T>
   class Matriz2D {
       int nfilas, ncolumnas;
       T **datos;
   public:
       Matriz2D(int nfilas, int ncolumnas) :
               nfilas(nfilas), columnas(ncolumnas) {
           datos = new T *[nfilas];
           for (int f = 0; f < nfilas; ++f) {
               datos[f] = new T[ncolumnas];
           }
       }
   
       void anadirFila();
       void anadirColumna();
       ...
   };
   
   inline void Matriz2D::anadirFila() {
       int filas = this.nfilas + 1;
       T **maux = new T *[filas];
       for (int i = 0; i < filas; ++i) {
           maux[i] = new T[this.ncolumnas];
           if (i < this.nfilas) {
               for (int j = 0; j < this.ncolumnas; ++j) {
                   maux[i][j] = datos[i][j];
               }
           }
       }
   }
   
   inline void Matriz2D::anadirColumna() {
       int columnas = this.columnas + 1;
       T **maux = new T *[this.nfilas];
       for (int i = 0; i < this.nfilas; ++i) {
           maux[i] = new T[columnas];
           for (int j = 0; j < columnas; ++j) {
               maux[i][j] = datos[i][j];
           }
       }
   }
   ```

   

3. 

   <img src="http://i.imgur.com/MgyTovp.png" style="zoom:50%;" />

   La condición que se debe satisfacer no es la que aparece más arriba. Sino:

   ```c++
   Si nFilas || nColumnas < 2^k entonces Excepción
       
   Demostración:
   k=1 
       2^1 = 2
       7 < 2 = Falso
   k=2 
       2^2 = 4
       7 < 4 = Falso
   k=3
       2^3 = 8
       7 < 8 = Verdadero entonces Excepción
   ```

   Por lo tanto, de la imagen de arriba solo cumplen la condición las dos primeras compresiones. 

   ```
   // Sin implementar
   ```



## Lección 6

![](http://i.imgur.com/EQM6PBI.png)

#### Soluciones:

1. V
2. F. La posición apuntada por el iterador es al principio es en tiempo constante. En cualquier otra posición en el peor de los casos es tiempo lineal.
3. V
4. F
5. V



![](http://i.imgur.com/l5dGbTt.png)

#### Soluciones:

1. 

   ```c++
   ListaEnlazada<T>::ListaEnlazada(Vector <T> v) : cabecera(0), cola(0) {
       if(!v.empty()) {
           for (int i = 0; i < v.size(); ++i) {
               Nodo <T> *nuevo = new Nodo<T>(v[i], 0);
               if (cola != 0)
                   cola->sig = nuevo;
               if (cabecera == 0)
                   cabecera = nuevo;
               cola = nuevo;
           }
       }
   }
   ```

2. 

   ```c++
   void ListaEnlazada<T>::invertir() {
       ListaEnlazada <T> *lista_invertida = new ListaEnlazada<T>();
       auto it = this.iterator();
       while (!it.fin()) {
           lista_invertida->insertarInicio(it.dato());
           Nodo <T> *borrado = it.dato();
           it.siguiente();
           delete borrado;
       }
   }
   ```

   

## Lección 7

![](http://i.imgur.com/BuJ8sPW.png)

#### Soluciones:

1. F

2. F

3. F. Lo inserta por detrás 

   ```c++
   p->siguiente = q->siguiente
   ```

   A partir de ahí no hace falta seguir leyendo. 

4. F

![](http://i.imgur.com/pow3m4k.png)

#### Soluciones:

1. 

   ```c++
   void ListaDEnlazada<T>::insertar(const IteradorD <T> &iterador, const T &dato) {
       if (iterador.dato() && this.cabecera != 0) {
           if (iterador.haysiguiente()) { // Posición intermedia
               dato->sig = iterador.dato()->sig;
               iterador.dato()->sig->ant = dato;
               dato->ant = iterador.dato();
               iterador.dato()->sig = dato;
           } else { // Insercción por el final
               this.cola->sig = dato;
               dato->ant = this.cola;
               dato->sig = 0;
               cola = dato;
           }
       } else { // No hay ningún elemento en la lista
           cola = cabecera = dato;
           cola->sig = 0;
           cola->ant = 0;
       }
   }
   ```

2. 

   ```c++
   void ListaCircularSimple<T>::inserta(const T &dato) {
       if (this.cola == 0) {
           this.cola = dato;
           this.cola->sig = this.cola;
           this.cola->ant = this.cola;
       } else {
           dato->sig = this.cola->sig;
           this.cola->sig = dato;
           dato->ant = this.cola;
           dato->sig->ant = dato;
           this.cola = dato;
       }
   }
   ```



## Lección 8

![](http://i.imgur.com/Ky8THj9.png)

#### Soluciones:

1. F
2. V
3. F
4. V
5. V
6. F



<img src="http://i.imgur.com/pzjsvLe.png" style="zoom:120%;" />

<img src="http://i.imgur.com/OGOhiAg.png" style="zoom:50%;" />

#### Soluciones:

1. 

   ![](http://i.imgur.com/o1ZsXoS.png)

   ```c++
   #include <iostream>
   
   using namespace std;
   
   #include <vector>
   
   void eliminaMultiplos(vector<int> *v, int pos) {
       for (int i = pos + 1; i < v->size(); ++i) {
           if (v->at(i) % v->at(pos) == 0) {
               auto it = v->begin();
               advance(it, i);
               v->erase(it);
           }
       }
   }
   
   vector<int> *primosMenores(int n) {
       vector<int> *primos = new vector<int>;
       for (int i = 2; i < n; ++i) {
           primos->push_back(i);
       }
       for (int j = 0; j < primos->size(); ++j) {
           eliminaMultiplos(primos, j);
       }
       return primos;
   }
   
   int main() {
       vector<int> *mis_primos = primosMenores(20);
       for (int i = 0; i < mis_primos->size(); ++i) {
           cout << mis_primos->at(i) << " ";
       }
       return 0;
   }
   ```

   ```bash
   2 3 5 7 11 13 17 19 
   Process finished with exit code 0
   ```

2. 

   ```c++
   #include <list>
   
   class CacheProductos {
   public:
       Producto &obtenerProducto(int id);
   
   private:
       list<Productos> *cache;
       BaseDeDatos *bbdd;
   };
   
   inline Producto &CacheProductos::obtenerProducto(int id) {
       auto it = cache->begin();
       while (it != cache->end()) {
           if (*it->id == id)
               return *it;
       }
       Producto &p = bbdd->obtenerProducto(id);
       if (cache->size() == 1000) {
           cache->pop_front();
       }
       cache->push_back(p);
   }
   ```



## Lección 9

![](http://i.imgur.com/3TPBCwO.png)

#### Soluciones:

1. V
2. V
3. V
4. V
5. F
6. F
7. V
8. V `Sin corregir`



![](http://i.imgur.com/FVxNljj.png)

#### Soluciones:

1. 

   ![](http://i.imgur.com/ChuoPzN.png)

   ```c++
   #include <iostream>
   
   using namespace std;
   
   #include <stack>
   
   // Versión recursiva
   int fibonacci(int n) {
       if (n == 1 || n == 2)
           return 1;
       else
           return fibonacci(n - 1) + fibonacci(n - 2);
   }
   
   //Versión con recursividad eliminada
   int fibonacciSinRecursividad(int n) {
       stack<int> pila;
       int resultado = 0;
       pila.push(n);
       do {
           if (pila.top() == 1 || pila.top() == 2) {
               resultado += 1;
               pila.pop();
           } else {
               int tope_pila = pila.top();
               pila.pop();
               pila.push(tope_pila - 1);
               pila.push(tope_pila - 2);
           }
       } while (!pila.empty());
       return resultado;
   }
   
   int main() {
       int num = 18;
       cout << "La serie es: " << endl;
       for (int i = 1; i < num; ++i) {
           cout << fibonacciSinRecursividad(i) << " ";
       }
       return 0;
   }
   ```

   ```bash
   La serie es: 
   1 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 
   Process finished with exit code 0
   ```

2. 

   ```c++
   #include <iostream>
   
   using namespace std;
   
   #include <stack>
   #include <queue>
   
   stack<int> *reverseQueue(queue<int> &q) {
       stack<int> *pila = new stack<int>();
       do {
           pila->push(q.front());
           cout << q.front() << " ";
           q.pop();
       } while (!q.empty());
       return pila;
   }
   
   
   int main() {
       queue<int> cola;
       for (int i = 0; i < 10; ++i) {
           cola.push(i);
       }
       cout << "Queue: ";
       stack<int> *pila = reverseQueue(cola);
       cout << endl;
       cout << "Stack: ";
       do {
           cout << pila->top() << " ";
           pila->pop();
       } while (!pila->empty());
       return 0;
   }
   ```

   ```bash
   Queue: 0 1 2 3 4 5 6 7 8 9 
   Stack: 9 8 7 6 5 4 3 2 1 0 
   Process finished with exit code 0
   ```

3.  

   ```
   Sin implementar
   ```

4. 

   ```
   Sin implementar
   ```




## Lección 10

![](http://i.imgur.com/EXzCWJg.png)

#### Soluciones:

1. F

2. V

3. V

4. F. Se hace un recorrido en inorden. 

5. V

6. F. 

   ```
   7->der = 12->der = 13. Después eliminamos 12
   ```

7. V

8. F. Solo hacia adelante. 



![](http://i.imgur.com/JxrCArP.png)

#### Soluciones:

1. 

   ```c++
   #include <vector>
   #include <queue>
   
   vector<T> recorreNiveles() {
       vector<T> nodosPorNiveles;
       queue<Nodo < T> *> cola;
       cola.push(this.raiz);
   
       while (!cola.empty()) {
           Nodo <T> *topCola = cola.top();
           cola.pop();
           nodosPorNiveles.push_back(topCola->dato);
   
           if (topCola->izq) cola.push(topCola->izq);
           if (topCola->der) cola.push(topCola->der);
       }
       return nodosPorNiveles;
   }
   ```

2. 

   ```c++
   int ABB::calculaAltura(Nodo <T> *p, int alt) {
       if (p) {
           int alt_izq, alt_der = alt;
           int alt_izq += calculaAltura(this->raiz->izq, alt + 1);
           int alt_der += calculaAltura(this->raiz->der, alt + 1);
           if (alt_izq > alt_der) return alt_izq;
           else return alt_der;
       } else return 0;
   
   }
   
   int ABB::altura() {
       int alt_izq = calculaAltura(this->raiz->izq, 1);
       int alt_der = calcularAltura(this->raiz->der, 1);
       if (alt_izq > alt_der) return alt_izq;
       else return alt_der;
   }
   
   // Otra solución
   #include <algorithm>
   
   int ABB::calcularAltura(Nodo <T> *p) {
       if (p) return (1 + max(calcularAltura(p->izq), calcularAltura(p->der)));
       else return 0;
   }
   
   int ABB::altura() {
       return calcularAltura(this->raiz);
   }
   ```

3. 

   ```c++
   #include <stack>
   
   bool Abb<T>::buscarNR(T &ele) {
       if (this->raiz) {
           stack<Nodo < T> *> pila;
           pila.push(this->raiz);
           while (!pila.empty()) {
               Nodo <T> *topePila = pila.top();
               pila.pop();
               if (topePila->dato == ele) return true;
               else {
                   if (topePila->izq) {
                       pila.push(topePila->izq);
                   }
                   if (topePila->der) {
                       pila.push(topePila->der);
                   }
               }
           }
       }
       return false;
   }
   ```



## Lección 11

![](http://i.imgur.com/8Ln1jWK.png)

#### Soluciones:

1. F. Caso 4. Rotación simple hacia izquierda.
2. V
3. V
4. F
5. V
6. F
7. F
8. V



![](http://i.imgur.com/sdMtOAF.png)

![](http://i.imgur.com/VNSYLV8.png)

#### Soluciones:

1. 

   <img src="http://i.imgur.com/fiIB8wc.png" style="zoom: 25%;" />

   <img src="http://i.imgur.com/akc9vta.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/qVEtF2e.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/6LgMUaF.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/RzP0iUO.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/RzP0iUO.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/t5iQysS.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/G6u40yn.png" style="zoom:25%;" />

   <img src="http://i.imgur.com/t5iQysS.png" style="zoom:25%;" />![](http://i.imgur.com/G6u40yn.png)<img src="http://i.imgur.com/t5iQysS.png" style="zoom:25%;" />![](http://i.imgur.com/G6u40yn.png)

   <img src="http://i.imgur.com/G6u40yn.png" style="zoom:25%;" />

2. 

   ```
   Sin implementar
   ```



## Lección 12

![](http://i.imgur.com/ONonSdU.png)

#### Soluciones:

1. V
2. F
3. V
4. V
5. V
6. V
7. V.

![](http://i.imgur.com/WJc6OmF.png)

#### Soluciones:

1. 

   <img src="http://i.imgur.com/83H7Y4J.png" style="zoom:50%;" />

2. 

   ```c++
   template<typename T>
   class Heap {
       T *arr; // El contenedor
       int tamal, tamaf; // tamaños logico y físico del contenedor
   public:
       Heap(int aTamaf = 500) {
           arr = new T[tamaf = aTamaf];
           tamal = 0;
       }
   
       ~Heap() { delete[] arr; }
   
       void push(const T &t); // Implementar
       void swap(T &a, T &b);
   };
   
   inline void Heap::swap(T &a, T &b) {
       T aux = a;
       a = b;
       b = aux;
   }
   
   inline void Heap::push(const T &t) {
       if (tamal == tamaf) {
           throw ("Error de espacio");
       } else {
           arr[taml++] = T;
           int posPadre = (taml - 1 - 1) / 2;
           int posActual = taml - 1;
           while (arr[posActual] < arr[posPadre]) {
               this->swap(arr[posActual], arr[posPadre]);
               posActual = posPadre;
               posPadre = (posActual - 1) / 2;
           }
       }
   }
   ```

3. 

   ```c++
   int ConjuntoDisjunto::busca(int dato) {
       int r = dato;
       while (rep[r] != r) {
           r = rep[r];
       }
       return r;
   }
   ```

   

## Lección 13

![](http://i.imgur.com/zAyyWPF.png)

#### Soluciones:

1. F
2. F
3. F. Habría que borrar y crear de nuevo.
4. V
5. F. Una lista de listas.
6. F. Un deque solo usa índices numéricos.
7. V
8. V

![](http://i.imgur.com/KFQTKgw.png)

#### Soluciones:

1. 

   ```c++
   #include <iostream>
   
   using namespace std;
   
   #include <set>
   #include <limits.h>
   
   int main() {
       // Creation
       multiset<int> box;
       for (int i = 0; i < 10000; ++i) {
           box.insert(rand() % 999);
       }
   
       // Counting 
       auto it = box.begin();
       int number_max, number_min, actual = -1, max_counter = 0, min_counter = 0;
       int repetition_max = INT_MIN, repetition_min = INT_MAX;
       while (it != box.end()) {
           if (actual != *it) {
               if (min_counter < repetition_min && min_counter > 0) {
                   number_min = *it - 1;
                   repetition_min = min_counter;
               }
               actual = *it;
               max_counter = min_counter = 0;
           }
           max_counter++;
           min_counter++;
   
           if (max_counter > repetition_max) {
               number_max = *it;
               repetition_max = max_counter;
           }
           it++;
       }
       cout << "Max number: " << number_max << " Repetition: " << repetition_max << endl;
       cout << "Min number: " << number_min << " Repetition: " << repetition_min << endl;
       return 0;
   }
   ```

   ```bash
   Max number: 20 Repetition: 20
   Min number: 989 Repetition: 1
   
   Process finished with exit code 0
   ```

2. 

   ```c++
       set<int> little_box;
       auto it2 = box.begin();
       while (it2 != box.end()) {
           little_box.insert(*it2);
           it2++;
       }
       cout << "Set size: " << little_box.size() << endl;
   ```

   ```bash
   Set size: 999
   
   Process finished with exit code 0
   ```

3. 

   ```
   //Sin implementar
   ```

4. 

   ```
   //Sin implementar
   ```

   

## Lección 14

![](http://i.imgur.com/lVQTmP7.png)

#### Soluciones:

1. V

2. V

3. F. Por lo dicho en 1

4. V

5. F

   ```c++
   vector<list<Entrada<T>>>
   ```

6. V

7. V

![](http://i.imgur.com/Kkpwjs0.png)

#### Soluciones:

1. 

   ```
   //Sin implementar
   ```

2. 

   ```
   //Sin implementar
   ```

   



## Lección 15

![](http://i.imgur.com/xln2U6d.png)

#### Soluciones:

1. F
2. V
3. F
4. V
5. F
6. V
7. V

![](http://i.imgur.com/XBVlphq.png)

#### Soluciones:

1. ​    

   ![](http://i.imgur.com/4oJ15kl.png)

2. 

   ![](http://i.imgur.com/xL4c1Yu.png)

3. 

   ```
   //Sin implementar
   ```

   

## Lección 16

![](http://i.imgur.com/wFd2qF5.png)

#### Soluciones:

1. V
2. V
3. F. Ya que hay que recorrer toda la estructura.
4. F. Al revés. 
5. V

![](http://i.imgur.com/6fFS38m.png)

![](http://i.imgur.com/LMOGmZG.png)

#### Soluciones:

1. 

   ```
   DFS: 0,1,2,3,4,5
   BFS: 0,1,5,2,4,3
   ```

2. 

   ```
   // Sin implementar
   ```

3. 

   ```
   // Sin implementar
   ```



## Lección 17

![](http://i.imgur.com/gO0wBVs.png)

#### Soluciones:

1. V
2. F
3. V
4. V
5. V
6. V

![](http://i.imgur.com/RizwpH7.png)

#### Soluciones:

1. 

   ```
   // Sin implementar
   ```

2. 

   ```
   // Sin implementar
   ```

3. 

   ```
   // Sin implementar
   ```

4. 

   ```
   // Sin implementar
   ```



## Lección 19

![](http://i.imgur.com/Vm3VoyO.png)

#### Soluciones:

1. F. Al revés.
2. V
3. F. Al revés.
4. V
5. F. Se necesitan dos accesos a disco.
6. F
7. V

![](http://i.imgur.com/kJyYCbO.png)

#### Soluciones:

1. 

   ```
   // Sin implementar
   ```

2. 

   ```
   // Sin implementar
   ```



## Lección 20

![](http://i.imgur.com/12KbLh4.png)

#### Soluciones:

1. F
2. F. A memoria no a disco.
3. V
4. F
5. F. Si está corrompido.
6. V

![](http://i.imgur.com/hE8UuTs.png)

#### Soluciones:

1. 

   ```
   // Sin implementar
   ```



## Lección 21

![](http://i.imgur.com/IQCuou5.png)

#### Soluciones:

1. F. Se mantienen en disco. 

2. V

3. F

4. V

   ```
   5*5*5*5 = 625
   ```

5. F

6. F

![](http://i.imgur.com/nUUkldA.png)

#### Soluciones:

1. 

   ![](http://i.imgur.com/jRnCbz0.png)

2. 

   ![](http://i.imgur.com/dbE8igw.png)