import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClosePopup]',
})
export class ClosePopupDirective {
  constructor(private elRef: ElementRef) {}

  @Output()
  public clickOutside = new EventEmitter<MouseEvent>();

  @HostListener('document:click', ['$event', '$event.target'])
  public onClick(event: MouseEvent, targetElement: HTMLElement): void {
    if (!targetElement) {
      return;
    }

    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      console.log('detected');
      this.clickOutside.emit(event);
    }
  }
}
