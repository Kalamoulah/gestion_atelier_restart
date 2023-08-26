import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CategoriService } from '../categori.service';
import { HttpHeaders } from '@angular/common/http';
import { NgModel } from "@angular/forms";
import { ResponseInterface } from '../interface/response.interface';
import { DataPaginate, Category } from '../interface/paginate.interface';


@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  data: Category[] = [];
  // data: {data:}[] = [];
  allCategory: number = 0;
  currentPage: number = 1;
  libelle: string = "";
  isButtonDisabled: boolean = true;
  id_category: number = 0
  isSwitchChecked: boolean = false;
  cat = { id: 1, libelle: '', checked: false };
  ids: number[] = []
  tab: number[] = []
  isSuccess: boolean = false;
  responseMessage: string = "";
  checkAll: boolean = false;
  isInputTouched: boolean = false;
  isInputFocused: boolean = false;
  constructor(private _categoriService: CategoriService) {
  }

  // getCategory() {
  //   this._categoriService.getAll(this.currentPage).subscribe((res: DataPaginate) => {
  //     console.log(res);
  //     this.data = res.data
  //     this.allCategory = res.meta.total;
  //     console.log(this.data);

  //   })
  // }
  getCategory() {
    this._categoriService.getAll(this.currentPage).subscribe((res: DataPaginate) => {
      console.log(res);
      this.data = res.data
      this.allCategory = res.meta.total;
      console.log(this.data);

    })
  }
  ngOnInit(): void {
    this.getCategory()
  }
  renderPage(event: number) {
    this.currentPage = event;
    this.getCategory();
  }

  addCategory() {
    const data = {
      libelle: this.libelle
    }
    this._categoriService.addCategorie(data).subscribe((res: ResponseInterface) => {
      console.log(res);
      if (res.success) {
        this.getCategory()
        this.isSuccess = true;
        this.responseMessage = `${res.message}`;

        // this.getCategory()

      } else {
        this.isSuccess = false;
        this.responseMessage = `${res.message}`;
      }
    })
    this.libelle = ''
  }

  search() {
    if (this.libelle.length < 3) {
      this.isButtonDisabled = true;
    }
    const data = {
      "libelle": this.libelle
    }

    this._categoriService.search(data).subscribe((res: ResponseInterface) => {
      console.log(res);
      if (!res.success) {
        this.isButtonDisabled = false;
        console.log("amoul dara");
      } else {
        this.isButtonDisabled = true;
        console.log("amna dara");
      }
        // this.isButtonDisabled = false;

      // this.isInputFocused = false; 
    }, (error) => {
      console.log(error);
    }
    )
  }

  // etatSwitchBtn() {

  // console.log(this.isSwitchChecked);

  // if (this.isSwitchChecked) {
  //   if (this.isInputTouched == true) {
  //     this.UpdateCategory()
  //   }
  // } else {
  //   this.isInputTouched = true;
  //   this.addCategory()
  // }
  // }

  //   etatSwitchBtn() {
  //     console.log(this.isSwitchChecked);

  //     if (this.isSwitchChecked) {
  //         if (this.isInputTouched) {
  //             this.UpdateCategory();
  //         }
  //     } else {
  //         this.isInputTouched = true;
  //         this.addCategory();
  //     }
  // }

  onFocus(id: string, value: string) {
    if (this.isSwitchChecked) {
      this.id_category = +id
      this.libelle = value
      this.isInputTouched = true;
      this.isButtonDisabled = false;
      this.isInputFocused = true;
    }
  }

  etatSwitchBtn() {
    console.log(this.isSwitchChecked);
    if (this.isSwitchChecked) {
      if (this.isInputTouched && this.isInputFocused) {
        this.UpdateCategory();
      }
    } else {
      this.isInputTouched = true;
      this.addCategory();
    }
    this.isInputFocused = false;
  }



  canDeleteCategory() {
    return this.checkboxChecked() && this.isSwitchChecked;
  }
  checkboxChecked() {
    return this.data.some(cat => cat.checked);
  }
  // onCheckboxChange(checkedCat: any) {
  //   if (checkedCat.checked) {
  //     this.ids.push(checkedCat.id);
  //   } else {
  //     this.ids = this.ids.filter((id) => id != checkedCat.id == true)
  //   }
  // }
  // onCheckboxChange(checkedCat: { id: number, libelle: string, checked: boolean}) {

  onCheckboxChange(checked: boolean, checkedCat: { id: number, libelle: string, checked?: boolean }) {
    checkedCat.checked = checked;
    if (checked) {
      this.ids.push(checkedCat.id);
      console.log(this.ids);
    } else {
      this.ids = this.ids.filter((id) => id !== checkedCat.id);
    }
    this.checkAll = this.data.every(cat => cat.checked)
  }

  UpdateCategory() {
    // if (this.libelle.length < 3) {
    //   this.isButtonDisabled = true;
    // }
    console.log(this.libelle);

    const data =
    {
      libelle: this.libelle,
    }
    const id = this.id_category
    this._categoriService.updateCategory(data, id).subscribe((res: ResponseInterface) => {
      console.log(res);
      if (res.success) {
         this.getCategory()
         window.location.reload()
        this.isSuccess = true;
        this.responseMessage = `${res.message}`;
        // this.getCategory()
      } else {
        this.isSuccess = false;
        this.responseMessage = `${res.message}`;
      }
    })
  }

  deleteCategory() {
    if (this.canDeleteCategory()) {
      const checkedCategory = this.data.filter(cat => cat.checked);
      const idsToDelete = checkedCategory.map(cat => cat.id);
      // console.log(idsToDelete);
      if (idsToDelete.length === 1) {
        this._categoriService.deleteCategory(idsToDelete[0]).subscribe((res: ResponseInterface) => {
          console.log(res);
          if (res.success) {
            this.isSuccess = true;
            this.responseMessage = `${res.message}`;
            this.getCategory()
          } else {
            this.isSuccess = false;
            this.responseMessage = `${res.message}`;
          }
          setTimeout(() => {
            this.responseMessage = '';
          }, 5000)
        });
      } else {
        this._categoriService.deleteCategory(idsToDelete).subscribe((res: ResponseInterface) => {
          console.log(res);
          this.getCategory()
        });
      }

    }
  }

  // checkedAll() {
  //  this.data.forEach(cat=>(cat.checked = this.checkAll))
  //  if (this.checkAll === true) {
  //    this.data.forEach(cat=>this.tab.push(cat.id))
  //  }else{
  //   this.data.forEach(cat=>this.tab.pop())
  //  }  
  //  console.log(this.tab);

  // }

  checkedAll() {
    this.data.forEach(cat => (cat.checked = this.checkAll));
    if (this.checkAll) {
      this.tab = this.data.map(cat => cat.id);
    } else {
      this.tab = [];
    }
  }
}


// function updateCategory() {
//   throw new Error('Function not implemented.');
// }

