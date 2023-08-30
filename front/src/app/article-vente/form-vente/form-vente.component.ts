import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { articleVente } from 'src/app/interface/article.interface';
import { Category } from 'src/app/interface/paginate.interface';
import { dataResponseCategory } from 'src/app/interface/response.interface';

@Component({
  selector: 'app-form-vente',
  templateUrl: './form-vente.component.html',
  styleUrls: ['./form-vente.component.css']
})
export class FormVenteComponent {

  @Input() categories!: dataResponseCategory[];
  @Input() categoriesVente!: Category[]
  @Output()  submitForm = new EventEmitter<articleVente>();
  promo: boolean = false

  AticleVenteForm!: FormGroup;
  backgroundImageSelected: any;
  photo!: any

  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer) {
    this.AticleVenteForm = this.fb.group({
      libelle: ['',[Validators.required, Validators.minLength(3)]],
      categorie: ['veullez selection un categorie',[Validators.required]],
      promo: [0, [Validators.required,]],
      cout: [0,[Validators.required]],
      marge: ['',[Validators.required]],
      prix: [0, [Validators.required]],
      reference: [''],
      // image: [''],
      confection: this.fb.array([]),
    });
    this.AticleVenteForm.addControl('path_url', this.fb.control(''));
  }
  // ngOnInit(): void {
  //   this.addNewRow(); 
  // }

  get confection(): FormArray {
    return this.AticleVenteForm.get('confection') as FormArray
  }

  addNewRow() {
    const newRow = this.fb.group({
      id: [''],
      libelleConf: [''],
      qte: [null],
    })
    this.confection.push(newRow)
  }

  onClickPromo(event: Event) {
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

  suggestion: dataResponseCategory[][] = [];

  onInputFieldLib(rowIndex: number) {

    const rowGroup = this.confection.controls[rowIndex] as FormGroup;
    const searchTerm = rowGroup.controls['libelleConf'].value;
    this.suggestion[rowIndex] = this.categories
      .filter(category => category.libelle.startsWith(searchTerm))
  }

  onSuggestionClick(suggestion: dataResponseCategory, rowIndex: number) {
    const rowGroup = this.confection.controls[rowIndex] as FormGroup;
    rowGroup.controls['libelleConf'].setValue(suggestion.libelle);
    rowGroup.controls['id'].setValue(suggestion.id);
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
         
        let costForRow  =0
        if (qte >= stock?.stock!) {
        //  alert('stock insuffisant, stock dispo: '+ stock?.stock!)
        
         rowGroup.controls['qte'].setValue('');
        }else{
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
        prix: cout + marge
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


  onSubmit() {
   console.log("mouus");
   
    const formData = this.AticleVenteForm.value;
    
    this.submitForm.emit(formData);

  }
}
