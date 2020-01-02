import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { UserProjectService } from '../service/user-project.service';
import { lmtWysiwygHtmlEditorConfig } from '../../../config/lmtWysiwygHtmlEditorConfig';
import { Skill, Profile } from '../model/project';
import { LmtAutocompleteParameter, ResearchFilter } from './../../../shared/components/lmt-autocomplete/model/lmt-autocomplete-param';
import { LmtAutocompleteConfigurationModel } from 'src/app/shared/components/lmt-autocomplete/model/lmt-autocomplete-config';
import { LMT_AUTO_COMPLETE_DEFAULT_CONFIGURATION } from 'src/app/shared/components/lmt-autocomplete/config/lmt-autocomplete-configs';
import { UserProjectMapper } from '../mapper/user-project';
import { select } from '@angular-redux/store';
import { SkillActions } from '../action/skill.action';
import { ProfileActions } from '../action/profile.action';
import { filter } from 'rxjs/operators';
import * as R from 'ramda';
@Component({
  selector:     'app-user-project',
  templateUrl:  './user-project.component.html',
  styleUrls:    ['./user-project.component.scss']
})
export class UserProjectComponent implements OnInit {

  @select( 'skills'   ) private _skillsReferential$:    Observable<Skill[]>;
  @select( 'profiles' ) private _profilesReferential$:  Observable<Profile[]>;  

  private _userProjectForm:       FormGroup;
  private _maxStartDate:          Date = new Date();
  private _minEndDate:            Date;
  lmtAutocompleteParamForProfile: LmtAutocompleteParameter; 
  lmtAutocompleteParamForSkill:   LmtAutocompleteParameter;

  private _lmtAutocompleteConfigForSkill:   LmtAutocompleteConfigurationModel;
  private _lmtAutocompleteConfigForProfile: LmtAutocompleteConfigurationModel;

  @Output() newProjectAdded: EventEmitter<any> = new EventEmitter();

  configTextEditor: AngularEditorConfig = lmtWysiwygHtmlEditorConfig;

  constructor(  readonly formBuilder:         FormBuilder,
                readonly userProjectService:  UserProjectService,
                readonly userProjectMapper:   UserProjectMapper,
                readonly skillActions:        SkillActions,
                readonly profileActions:      ProfileActions ) {

    this.skillActions.load();
    this.profileActions.load();

    this._lmtAutocompleteConfigForSkill   = { ...LMT_AUTO_COMPLETE_DEFAULT_CONFIGURATION, placeholder: 'SKILLS' };
    this._lmtAutocompleteConfigForProfile = { ...LMT_AUTO_COMPLETE_DEFAULT_CONFIGURATION, placeholder: 'ROLES'  };
  }

  ngOnInit() {
    this.createUserProjectForm    ();
    this.setupProjectDateInterval ();
    
    this._profilesReferential$
        .pipe     ( filter ( profiles => !R.isNil( profiles ) ) )
        .subscribe( profiles => {
          this.lmtAutocompleteParamForProfile = {
            datasource:             profiles,
            attributeNameToDisplay: 'name',
            attributeNameForFilter: 'name',
            attributeNameKey:       'id',
            researchFilter: ResearchFilter.NORMALIZED
          };
        });

    this._skillsReferential$
        .pipe     ( filter ( skills => !R.isNil( skills ) ) )
        .subscribe( skills => {
          this.lmtAutocompleteParamForSkill = {
            datasource:             skills,
            attributeNameToDisplay: 'name',
            attributeNameForFilter: 'name',
            attributeNameKey:       'id',
            researchFilter: ResearchFilter.NORMALIZED
          };
        });
    
  }

  private createUserProjectForm(): void {
    this._userProjectForm = this.formBuilder.group({
      entitle:        [ '', [ Validators.required ] ],
      description:    [ '', [ Validators.required ] ],
      enterpriseName: [ '', [ Validators.required ] ],
      startDate:      [ '', [ Validators.required ] ],
      endDate:        [ ''  ],
      profiles:       [ '', [ Validators.required ] ],
      skills:         [ '', [ Validators.required ] ],
    });
  }


  private setupProjectDateInterval(): void {
    this.updateMinEndDateWhenStartDateChanged();
    this.updateMaxStartDateWhenEndDateChanged();
  }

  private updateMinEndDateWhenStartDateChanged(): void {
    this._userProjectForm.get( 'startDate' ).valueChanges.subscribe(
        selectedStartDate => {
          this._minEndDate = selectedStartDate ? selectedStartDate : null; 
        }
    );
  }

  private updateMaxStartDateWhenEndDateChanged(): void {
    this._userProjectForm.get( 'endDate' ).valueChanges.subscribe(
        selectedEndDate => {
          this._maxStartDate = selectedEndDate ? selectedEndDate : new Date();
        }
    );
  }

  public saveUserProject(): void {
    if ( !this._userProjectForm.valid ) {
      console.error( 'form user project is not valid, can not save it' );
      return;
    }
    //  this.saveProject.emit(this._userProjectForm.value);
    // TODO will implement interceptor to catch request and response ....
    console.warn( 'employee id is hard coded' );
    this.userProjectService.saveProject ( 1, this.userProjectMapper.mapFromFormToModel( this._userProjectForm.value ) )
                           .subscribe   ( data => { 
                                          this.newProjectAdded.emit( null );  
                                          console.log ( 'project saved: ', data ); 
                                          } );
    
  }

  /****************** G E T T E R S **********************/
  get userProjectForm                 () { return this._userProjectForm;                  }
  get maxStartDate                    () { return this._maxStartDate;                     }
  get minEndDate                      () { return this._minEndDate;                       }
  get lmtAutocompleteConfigForSkill   () { return this._lmtAutocompleteConfigForSkill;    }
  get lmtAutocompleteConfigForProfile () { return this._lmtAutocompleteConfigForProfile;  }
}

