import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { validatorArrayForm } from 'src/app/Validators/Validator';
import { articleVente } from 'src/app/interface/article.interface';
import { Category } from 'src/app/interface/paginate.interface';
import { dataResponseCategory } from 'src/app/interface/response.interface';

@Component({
  selector: 'app-form-vente',
  templateUrl: './form-vente.component.html',
  styleUrls: ['./form-vente.component.css']
})
export class FormVenteComponent {

  isEditMode: boolean = false;
  @Input() categories: dataResponseCategory[] = [];
  @Input() categoriesVente!: Category[]
  @Output() submitForm = new EventEmitter<articleVente>();
  promo: boolean = false
  AticleVenteForm!: FormGroup;
  backgroundImageSelected: any;
  photo!: any
  suggestion: dataResponseCategory[][] = [];


  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.AticleVenteForm = this.fb.group({
      libelle: ['', [Validators.required]],
      categorie: ['veullez selection un categorie', [Validators.required]],
      promo: [0, [Validators.required,]],
      cout: ["", [Validators.required]],
      marge: ["", [Validators.required]],
      prix: ["", [Validators.required]],
      reference: [''],
      // image: [''],
      confection: this.fb.array([],
        [Validators.required]
        ),
    });
    this.AticleVenteForm.addControl('path_url', this.fb.control(''));
  }
  ngOnInit(): void {
    this.addNewRow(); 
  }

  get confection(): FormArray {
    return this.AticleVenteForm.get('confection') as FormArray
  }

  chargerFormulaire(article: articleVente) {
    this.AticleVenteForm?.patchValue(article);
    this.backgroundImageSelected = this.sanitizer!.bypassSecurityTrustUrl(article.path_url);
    
    while (this.confection.length !== 0) {
      this.confection.removeAt(0);
    }
    article.confection.forEach(conf => {
      this.confection.push(new FormGroup({
        id: new FormControl([conf.id]),
        libelleConf: new FormControl([conf.libelleConf]),
        qte: new FormControl([conf.quantity]),
        categorie: new FormControl([conf.categorie]),

      }));
    });
    this.isEditMode = true;
  }

    addNewRow() {
  
      const newRow = this.fb.group({
        id: [''],
        libelleConf: [''],
        qte: [null],
        categorie: ['null'],
      })
      //  if (this.confection.length == 0) {
      //    this.confection.push(newRow)
      //    return
      //  }
      //   if (!this.confection.at(this.confection.length - 1)?.valid) {
      //    alert("Zoom baby");
      //    return
      //    }
         this.confection.push(newRow)
    }
  onClickPromo(event: Event) {
    console.log(this.categories);
    
    const target = event.target as HTMLInputElement;
    this.promo = target.checked;
  }

  // onInputField(rowIndex: number) {
  //   const rowGroup = this.confection.controls[rowIndex] as FormGroup;
  //   const searchTerm = rowGroup.controls['libelleConf'].value;
  //   const matchingCategory = this.categories.find(category => category.libelle === searchTerm);


  //   if (matchingCategory) {
  //     console.log('Matching category:', matchingCategory);
  //   } else {
  //     console.log('No matching category found.');
  //   }
  // }


  onInputFieldLib(rowIndex: number) {

    const rowGroup = this.confection.controls[rowIndex] as FormGroup;
    const searchTerm = rowGroup.controls['libelleConf'].value;
      // console.log(searchTerm);
      // console.log(this.categories);

    const libelleConfControl = rowGroup.get('libelleConf');
    libelleConfControl?.setValidators([validatorArrayForm.validateCategories(this.categories, this.confection)]);
    libelleConfControl?.updateValueAndValidity();

    this.suggestion[rowIndex] = this.categories!
      .filter(category => category.libelle.startsWith(searchTerm)
      )
    // console.log(this.suggestion);
  }

  onSuggestionClick(suggestion: dataResponseCategory, rowIndex: number) {
    console.log(suggestion);
    
    const rowGroup = this.confection.controls[rowIndex] as FormGroup;
    rowGroup.controls['libelleConf'].setValue(suggestion.libelle);
    rowGroup.controls['id'].setValue(suggestion.id);
    rowGroup.controls['categorie'].setValue(suggestion.categorie!);
    
    // console.log(suggestion);
  }

  onInputFielQtr(rowIndex: number) {
    let totalCost = 0;
    for (let i = 0; i < this.confection?.controls.length; i++) {
      const rowGroup = this.confection.controls[i] as FormGroup;

      let qte = rowGroup.controls['qte'].value;
      const prix = this.suggestion[i]?.find(suggestion =>
        suggestion.libelle === rowGroup.controls['libelleConf'].value)?.prix || 0;

      const stock = this.suggestion[i]?.find(suggestion =>
        suggestion.stock
      )
      let costForRow = 0
      if (qte >= stock?.stock!) {
        alert('stock insuffisant, stock dispo: ' + stock?.stock!)


        rowGroup.controls['qte'].setValue('');
      } else {
        costForRow = qte * prix
        totalCost += costForRow;
      
      }

    }

    this.AticleVenteForm.patchValue({
      cout: totalCost
    });
  }


  onInputFieldMarge() {
    let marge = this.AticleVenteForm.value.marge;
    let cout = this.AticleVenteForm.value.cout

    let maximumMarge = cout / 3;
    if (marge >= 500 && marge <= maximumMarge) {
      console.log(cout);
      this.AticleVenteForm.patchValue({
        prix: cout + +marge
      });
    }
  }

  isValidImage(name: string): boolean {
    const extention: string[] = ['jpeg', 'png', 'jpg', 'gif']
    return extention.includes(name.substring(6))
  }

  selectImage(event: Event) {
    this.photo = event.target as HTMLInputElement;
    this.photo = this.photo.files?.[0]
    console.log(this.photo);

    // const selectedImage: File | undefined = inputElement.files?.[0]
    if (!this.isValidImage(this.photo!.type)) {
      alert('nono')
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        this.photo = reader.result as string;
        this.AticleVenteForm.patchValue({ path_url: this.photo });
        this.backgroundImageSelected = this.sanitizer!.bypassSecurityTrustUrl(this.photo);
        // console.log(this.photo);

      };
      reader.readAsDataURL(this.photo);
    }
  }

  validInput(name: string) {
    const regex = /^[0-9]*$/;
    let inputValue = this.AticleVenteForm.value[name];
    if (!regex.test(inputValue)) {
      this.AticleVenteForm.get(name)?.patchValue(inputValue.replace(/[^0-9]/g, ''));
    }
  }


  onSubmit() {
    const formData = this.AticleVenteForm.value;
    this.submitForm.emit(formData);
  }
}
