import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import {TodoService} from '../../services/todo.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  data: any  = {};

  constructor(
    private todoService: TodoService,
    public snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getAllTodos();
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.updateTodo();
  }

  addTodo(todo:any) {
    const obj = { todo: todo.value };
    this.todoService.addTodo(obj)
      .subscribe((res: any) => {
        this.openSnackBar(res.message);
        this.getAllTodos();
        todo.value = '';
      });
  }

  getAllTodos() {
    this.todoService.getAllTodos()
      .subscribe((res:any) => {
        console.log(res);
        Object.keys(res).forEach((key) => {
          this.data[key] = res[key];
        });
      });
  }

  updateTodo() {
    this.todoService.updateTodo(this.data)
      .subscribe((res) => {
        console.log(res);
      });
  }

  removeTodo(id:any) {
    if (confirm('Bu maddeyi silmek istediğinize emin misiniz?')) {
      this.todoService.removeTodo(id)
        .subscribe((res) => {
          console.log(res);
          this.getAllTodos();
        });
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Tamam', {
      duration: 2000,
    });
  }

}
