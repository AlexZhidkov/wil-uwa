import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { EoiBusiness } from '../model/eoi-business';
import { EoiBusinessService } from '../services/eoi-business.service';
import { UserProfile } from '../model/user-profile';
import { UniversityTodoService } from '../services/university-todo.service';
import { EventStoreService } from '../services/event-store.service';

export interface Semester {
  number: number;
  dates: string;
}

@Component({
  selector: 'app-eoi-business',
  templateUrl: './eoi-business.component.html',
  styleUrls: ['./eoi-business.component.scss']
})
export class EoiBusinessComponent implements OnInit {
  smallScreen: boolean;
  semesters: Semester[];
  jobFormGroup: FormGroup;
  employerFormGroup: FormGroup;
  datesFormGroup: FormGroup;
  supervisorFormGroup: FormGroup;

  user: UserProfile;
  eoiBusinessUrl: string;
  projectId: string;
  eoiId: string;
  isNewProject: boolean;
  eoiDoc: AngularFirestoreDocument<EoiBusiness>;
  eoi: Observable<EoiBusiness>;
  isLoading: boolean;
  previouslySubmittedEois: Observable<EoiBusiness[]>;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private formBuilder: FormBuilder,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
    private eoiBusinessService: EoiBusinessService,
    private universityTodoService: UniversityTodoService,
    private eventStoreService: EventStoreService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.breakpointObserver.observe([
      Breakpoints.XSmall,
      Breakpoints.Small
    ]).subscribe(result => {
      this.smallScreen = result.matches;
    });

    this.user = JSON.parse(localStorage.getItem('user'));
    this.eoiBusinessUrl = '/users/' + this.user.uid + '/eoiBusiness';

    this.projectId = this.route.snapshot.paramMap.get('id');
    this.eoiId = this.route.snapshot.paramMap.get('eoiId');
    this.isNewProject = (this.route.snapshot.paramMap.get('isNewProject') === 'true');

    this.semesters = [
      { number: 1, dates: 'Semester 1. 25 February - 	24 May' },
      { number: 2, dates: 'Semester 2. 29 July - 25 October' },
      { number: 3, dates: 'Semester 3. ' },
      { number: 4, dates: 'Semester 4. ' }
    ];

    this.eoiBusinessService.setCollection(this.eoiBusinessUrl);
    this.previouslySubmittedEois = this.eoiBusinessService.list();

    if (this.isNewProject) {
      this.afs.collection<EoiBusiness>(this.eoiBusinessUrl)
        .add({
          businessId: this.user.uid,
          projectGroupId: this.projectId,
          isNew: false,
          title: '',
          description: '',
          skills: '',
          clearance: '',
          name: '',
          website: '',
          primaryContact: '',
          address: '',
          about: '',
          dates: '',
          supervisor: '',
          supervisorRole: '',
          supervisorExperience: '',
          supervisorPhone: '',
          supervisorEmail: '',
        })
        .then(r => {
          this.eoiDoc = this.afs.doc<EoiBusiness>(this.eoiBusinessUrl + '/' + r.id);
          this.bindFormControls();
        });
    } else {
      this.eoiDoc = this.afs.doc<EoiBusiness>(this.eoiBusinessUrl + '/' + this.eoiId);
      this.bindFormControls();
    }
  }

  bindFormControls() {
    this.eoi = this.eoiDoc.valueChanges();
    this.eoi.subscribe(r => {
      this.isLoading = false;
      this.jobFormGroup = this.formBuilder.group({
        jobTitleCtrl: [r.title, Validators.required],
        jobDescriptionCtrl: [r.description, Validators.required],
        skillsCtrl: [r.skills],
        clearanceCtrl: [r.clearance]
      });
      this.employerFormGroup = this.formBuilder.group({
        nameCtrl: [r.name, Validators.required],
        websiteCtrl: [r.website],
        primaryContactCtrl: [r.primaryContact, Validators.required],
        addressCtrl: [r.address],
        aboutCtrl: [r.about, Validators.required]
      });
      this.datesFormGroup = this.formBuilder.group({
        datesCtrl: [r.dates]
      });
      this.supervisorFormGroup = this.formBuilder.group({
        supervisorCtrl: [r.supervisor, Validators.required],
        supervisorRoleCtrl: [r.supervisorRole],
        supervisorExperienceCtrl: [r.supervisorExperience],
        supervisorPhoneCtrl: [r.supervisorPhone, Validators.required],
        supervisorEmailCtrl: [r.supervisorEmail, Validators.required]
      });
    });
  }

  CloneFromEoi(id: any) {
    this.eoiDoc.update(id);
  }

  submitEoi() {
    this.eoiDoc.get()
      .subscribe(eoiBusinessSnapshot => {
        const eoiBusiness = eoiBusinessSnapshot.data() as EoiBusiness;
        this.universityTodoService.setCollection('universities/uwa/todo');
        this.universityTodoService
          .add({ title: 'Placement request received', eoiBusiness })
          .then(() => this.openSnackBar('Thank you for applying to your project'))
          .catch(() => this.openSnackBar('ERROR: failed to submit application'));
        this.eventStoreService
          .add({
            event: 'Business applied for placement',
            user: {
              uid: this.user.uid,
              displayName: this.user.displayName
            }, eoiBusiness
          });
      });
    this.router.navigateByUrl('business');
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, null, {
      duration: 2000,
    });
  }
}
