import { Injectable } from '@angular/core';
import { ticket } from './ticket';
import { Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServicosService {

  pagos=[
    {codigo: '1', hrinicial:'09:10',hrfinal:'11:10',valor: 5.00},
    {codigo: '2', hrinicial:'14:05',hrfinal:'16:05',valor: 10.00},
    {codigo: '3', hrinicial:'15:35',hrfinal:'16:30',valor: 5.00}
  ];
  verifica:boolean=true;
  codigo:string='';
  valor:number=0;
  tickets: Observable<ticket[]>;
  ticketCollection: AngularFirestoreCollection<ticket>;

  constructor(private afs: AngularFirestore) { 
    this.ticketCollection=this.afs.collection<ticket>('bdticket');
    this.tickets=this.ticketCollection.snapshotChanges().pipe( 
        map( actions=>{ 
          return actions.map( a=>{
            const data=a.payload.doc.data();
            const id=a.payload.doc.id;
            return {id, ...data}
          });
        } ) 
      );
  }

  Pagos(): ticket[]{
    return this.pagos;
  }

  Add(t:ticket):Promise<DocumentReference>{
    //this.pagos.push(t);
    return this.ticketCollection.add(t);
  }

  Verifica(codigo:string):boolean{
    let verifica = this.pagos.find(c => c.codigo == codigo)
    if(verifica==null){
      return false;
    }
    else{
      return true;
    }
  }
}
