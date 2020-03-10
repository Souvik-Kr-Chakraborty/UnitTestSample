import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ValidatorFn, AbstractControl, FormArray } from '@angular/forms';

//json data from any datasource
const jsonDataSource =   
`[
    {
      "type": "text",
      "fieldName": "Name",
      "fieldValue": "Souvik",
      "placeHolder": "Name",
      "readonly": false,
      "required": false
    },
    {
      "type": "checkbox",
      "fieldName": "Country",
      "fieldValue": "India",
      "readonly": false,
      "required": true,
      "options": [
        {
          "value": "India",
          "status": true
        },
        {
          "value": "UK",
          "status": false
        },
        {
          "value": "USA",
          "status": true
        }
      ]
    }
  ]`;

//   {
//     "type": "selector",
//     "fieldName": "State",
//     "fieldValue": "TN",
//     "readonly": false,
//     "required": true,
//     "options": [
//       {
//         "value": "WB",
//         "status": false
//       },
//       {
//         "value": "MH",
//         "status": true
//       }
//     ]
//   },
//   {
//     "type": "radio",
//     "fieldName": "District",
//     "fieldValue": "TN",
//     "readonly": false,
//     "required": true,
//     "options": [
//       {
//         "value": "Hooghly",
//         "status": false
//       },
//       {
//         "value": "Bankura",
//         "status": true
//       },
//       {
//         "value": "Nadia",
//         "status": false
//       }
//     ]
//   },

interface FieldOutput {
    fieldName?: string,
    fieldValue?: string
}

interface OptionDetails {
    value?: string,
    status?: string
}

interface FieldDetails {
    type?: string,
    fieldName?: string,
    fieldValue?: string,
    placeHolder?: string,
    readonly?: boolean,
    required?: boolean, 
    options?: OptionDetails[]
}

@Component({
    selector: 'idc-form-app',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.css']
})
export class HomePage implements OnInit {
    
    data: FieldDetails[] = JSON.parse(jsonDataSource); 
    configMode = false;
    public myForm: FormGroup;
    public configOptionForm: FormGroup;
    formConfig: FieldDetails = {};

    constructor(private formBuilder: FormBuilder) {
        this.myForm = this.formBuilder.group({
            fields: new FormArray([])
        });
        this.setFields();
        this.configOptionForm = this.formBuilder.group({
            options: new FormArray([
                new FormControl(''),
            ])
        })
    }

    ngOnInit() {}

    setFields(){
        let index = 0;
        this.data.forEach(field => {
            switch(field.type){
                case 'text':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.minLength(2)]
                    }))
                    break;
                }
                case 'number':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.minLength(10)]
                    }))
                    break;
                }
                case 'tel':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.minLength(8)]
                    }))
                    break;
                }
                case 'url':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.minLength(2)]
                    }))
                    break;
                }
                case 'email':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.email]
                    }))
                    break;
                }
                case 'password':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.pattern('^[a-zA-Z]+$')]
                    }))
                    break;
                }
                case 'date':{
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: field.fieldValue
                    }))
                    break;
                }
                case 'selector':
                case 'radio':
                case 'checkbox':{
                    this.fields.push(this.formBuilder.group({
                        options: new FormArray([])
                    }));
                    this.setFieldOptions(field, index);
                    break;
                }
                default: {
                    this.fields.push(this.formBuilder.group({
                        fieldvalue: [field.fieldValue, Validators.minLength(2)]
                    }))
                    break;
                }
            }
            index++;
        })
    }

    get fields(): FormArray {
        return this.myForm.get('fields') as FormArray;
    }

    setFieldOptions(field: FieldDetails, index){
        let optionsFormArray = this.fields.controls[index].get('options') as FormArray
        field.options.forEach(option => {
            optionsFormArray.push(this.formBuilder.group({
                option: [option.value]
            }))
        });
    }

    get options(): FormArray {
        return this.configOptionForm.get('options') as FormArray;
    }

    toggleConfigMode() {
        this.configMode = !this.configMode;
    }

    deleteField(index) {
        this.fields.removeAt(index); 
        this.data.splice(index, 1);
    } 

    addOption(){ 
        this.options.push(new FormControl('', Validators.required));
    }

    deleteOption(index){
        this.options.removeAt(index);
    }

    validateAddFieldForm(){
        if(this.isAddFieldFormValid()){
            this.addFormField()
        } else {
            alert("Please fill up all required informations to add a field.")
        }
    }

    isAddFieldFormValid(): boolean{
        if(this.formConfig.type){
            if((this.formConfig.type=='text'
            || this.formConfig.type=='number' 
            || this.formConfig.type=='tel'
            || this.formConfig.type=='url'
            || this.formConfig.type=='email'
            || this.formConfig.type=='password') && 
            (this.formConfig.fieldName 
            && this.formConfig.placeHolder)){
                return true;
            } else if((this.formConfig.type=='checkbox'
            || this.formConfig.type=='radio') && 
            (this.formConfig.fieldName
            && this.options.valid 
            && this.options.value.length>1)){
                return true;
            } else if(this.formConfig.type=='selector' && 
            (this.formConfig.fieldName
            && this.formConfig.placeHolder
            && this.options.valid 
            && this.options.value.length>1)){
                return true;
            } else if(this.formConfig.type=='date' && 
            this.formConfig.fieldName
            && this.formConfig.placeHolder){
                return true;
            } else {
                return false;
            }
        } else{
            return false;
        }
    }

    addFormField() {
        this.toggleConfigMode();
        var fieldDetails: FieldDetails = {
            type: this.formConfig.type,
            fieldName: this.formConfig.fieldName,
            placeHolder: this.formConfig.placeHolder,
            readonly: this.formConfig.readonly,
            required: this.formConfig.required,
        }
        if(this.options.value.length>1){
            this.data.push({...fieldDetails, options: this.options.value});    
        }else {
            this.data.push(fieldDetails);    
        }
        switch(this.formConfig.type){
            case 'text':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.minLength(2)]
                }))
                break;
            }
            case 'number':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.minLength(10)]
                }))
                break;
            }
            case 'tel':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.minLength(8)]
                }))
                break;
            }
            case 'url':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.minLength(2)]
                }))
                break;
            }
            case 'email':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.email]
                }))
                break;
            }
            case 'password':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['', Validators.pattern('^[a-zA-Z]+$')]
                }))
                break;
            }
            case 'date':
            case 'selector':
            case 'radio':
            case 'checkbox':{
                this.fields.push(this.formBuilder.group({
                    fieldvalue: ['']
                }))
                this.resetOptionsControl();
                break;
            }
            default: {
                this.fields.push(new FormControl('', Validators.minLength(2)));
                break;
            }
        }
        console.warn("FormArray :"+this.fields.value);
        this.formConfig = {}; //resetting config input data
    }
    
    onSubmit(){ 
        let outputApiData: FieldOutput[] = []
        if (this.myForm.invalid) {
            window.alert("Data invalid or incomplete");
        } else {
            let index = 0
            for(let control of this.fields.controls){
                this.data[index].fieldValue = control.value.fieldvalue;
                if(this.data[index].type=='date' && this.data[index].fieldValue){
                    outputApiData.push({
                        fieldName: this.data[index].fieldName,
                        fieldValue: new Date(this.data[index].fieldValue).getTime().toString()
                    });
                } else {
                    outputApiData.push({
                        fieldName: this.data[index].fieldName,
                        fieldValue: this.data[index].fieldValue
                    });
                }
                index++;
            }
            window.alert("Output data for API::\n"+JSON.stringify(outputApiData));
            console.warn("Layout Config::\n"+JSON.stringify(this.data));
        }
    }

    resetOptionsControl(){
        while (this.options.length) {
            this.options.removeAt(0);
        }
        this.options.push(new FormControl(''));
    }

    isEmptyForms(){
        return this.data.length==0;
    }

    updateSelectedOptions(event, fieldsKey: number, value: string){
        let checked = new Set(this.data[fieldsKey].fieldValue.split(','));
        if (event.target.checked) {
            checked.add(value)
        } else {
            checked.delete(value)
        }
        this.data[fieldsKey].fieldValue = Array.from(checked.values()).toString();
    }
}