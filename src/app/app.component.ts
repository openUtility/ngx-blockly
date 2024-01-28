import { AfterViewInit, Component, ViewChild } from '@angular/core';

// import { ExampleBlock } from './blocks/example.block';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

    
    constructor() {
        
    }

    ngAfterViewInit(): void {

    }

    onCode(code: string) {
        console.log(code);
    }
}
