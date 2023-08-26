import { Component, EventEmitter, Output, Input, OnInit, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ArticleInterface, fournisseurCategory } from 'src/app/interface/article.interface';
import { DataForm } from 'src/app/interface/dataForm.interface';
import { ResponseInterface, dataResponseCategory, fourniseurFilter } from 'src/app/interface/response.interface';
import { ArticleService } from 'src/app/services/article.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})

export class FormComponent implements OnChanges {
  @Input() dataForm!: fournisseurCategory
  @Input() articleData!: ArticleInterface[]
  @Input() articleDataUpdate!: ArticleInterface
  @Output() formDataArticle: EventEmitter<FormData> = new EventEmitter<FormData>();
  categories!: dataResponseCategory[];
  backgroundImageSelected: SafeUrl = ''
  image: File | undefined;
  articleForm!: FormGroup;
  fournisseurData!: fourniseurFilter[];
  listfournisseur!: dataResponseCategory[]
  selectedIds: number[] = [];
  fournisseurSelected!: dataResponseCategory[]
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>
 
  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.fournisseurSelected = []
    this.articleForm = this.fb.group({
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      prix: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      stock: [0, [Validators.required, Validators.pattern('^[0-9]*$')]],
      Fournisseur: [[], [] ],
      selectedOption: ["", Validators.required],
      reference: ["", Validators.required],
      image: [""],
    });
  }

  chargerFormulaire(article: ArticleInterface)
  {
    this.articleForm?.patchValue(article);
    
  }
  

  ngOnChanges(changes: SimpleChanges): void {
   
    console.log(changes['articleDataUpdate']?.currentValue);
    this.articleForm.patchValue({
      libelle: changes['articleDataUpdate']?.currentValue?.libelle,
      prix: changes['articleDataUpdate']?.currentValue?.prix,
      stock: changes['articleDataUpdate']?.currentValue?.stock,
      selectedOption: changes['articleDataUpdate']?.currentValue?.categorie,
      reference: changes['articleDataUpdate']?.currentValue?.reference,
    })
    this.backgroundImageSelected = 'http://localhost:8000/storage/' + changes['articleDataUpdate']?.currentValue?.path_url;

    if (changes['articleDataUpdate']?.currentValue?.fournisseurs) {
        this.selectedIds = changes['articleDataUpdate']?.currentValue?.fournisseurs;
    } else {
      this.selectedIds = [];
    }
  } 

  // =====================================================================================//

    selectImage(event: Event): void {
      
      const inputElement = event.target as HTMLInputElement;
      const selectedImage :File |undefined= inputElement.files?.[0]
      console.log(selectedImage);
      if (!this.isValidImage(selectedImage!.type)) {
        console.log('nono');
      }else{
        const reader = new FileReader();
        reader.onload = (e:any)=>{
          const imageBase64 = e.target.result.split(',')[1];
          console.log(e.target.result);
          this.backgroundImageSelected = this.sanitizer!.bypassSecurityTrustUrl(e.target.result);;
        }
        reader.readAsDataURL(selectedImage!);
      }
    }

  isValidImage(name: string):boolean
  {
    const extention: string[]= ['jpeg','png','jpg','gif']
     return extention.includes(name.substring(6)) 
  }

  // ===================================================================================//

  selectedFournisseurs: fourniseurFilter[] = [];
  toggleSelection(id: number) {
    const index = this.selectedIds.indexOf(id);
    
    if (index !== -1) {
      this.selectedIds.splice(index, 1);
      this.removeSelected(id)
    } else {
      this.selectedIds.push(id);
      this.fournisseurSelected = this.dataForm.fournisseurs.filter((four => this.selectedIds.includes(four.id!)))
    }
  }

  searchFourniseur() {
 
    const searchTerm = this.articleForm.value.Fournisseur.toLowerCase()
    if (searchTerm === "") {
      this.listfournisseur = []
    } else {
      this.listfournisseur = this.dataForm.fournisseurs.filter((four => four.libelle.toLocaleLowerCase()
        .startsWith(searchTerm) && !this.selectedIds.includes(four.id!)))
    }
    this.fournisseurSelected = this.dataForm.fournisseurs.filter((four => this.selectedIds.includes(four.id!)))
    console.log(this.fournisseurSelected);
  }

  removeSelected(id: number) {
    const index = this.selectedIds.indexOf(id)
    if (index !== -1) {
      this.selectedIds.splice(index, 1);
    }
    this.fournisseurSelected = this.fournisseurSelected.filter(four => four.id !== id);
  }

  // ===================================================================================//

  generateReference() {
    let index = 0
    let reference = ""
    let libellePrefix = this.articleForm.value.libelle.slice(0, 3).toLowerCase();
    console.log(libellePrefix);
    
    const categorieValue = this.articleForm.get('selectedOption')!.value
    let categorie = this.articleData.map(cat => cat.categorie);
    let specificCategorie = categorie.filter(cat => cat == categorieValue)
    console.log(specificCategorie);

    if (specificCategorie.length == 0) {
      index = 1
    } else {
      index = specificCategorie.length + 1
    }

    if (libellePrefix) {
      reference = `ref-${libellePrefix}`
    }

    if (categorieValue) {
      reference = `ref-${libellePrefix}-${categorieValue}-${index}`;
    }

    this.articleForm.patchValue({
      reference: reference
    })
  }
  // ===================================================================================

  sendingDataForm() {
    const formData = new FormData();
    // console.log(this.image);
    if (this.image) {
      formData.append('path_url', this.image, this.image.name);
    }
    formData.append('libelle', this.articleForm.value.libelle);
    formData.append('prix', this.articleForm.value.prix);
    formData.append('stock', this.articleForm.value.stock);
    formData.append('categorie', this.articleForm.value.selectedOption);
    const selectedIdsString = this.selectedIds.join(',');
    formData.append('fournisseur', selectedIdsString);
    formData.append('reference', this.articleForm.value.reference);
    this.formDataArticle.emit(formData);
    // this.viderChamp()
    const formDataObject: any = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    console.log(formDataObject);
  }

  // =====================================================================================//

  viderChamp() {
    this.articleForm.reset();
    this.fileInput.nativeElement.value = ''
  }



}
