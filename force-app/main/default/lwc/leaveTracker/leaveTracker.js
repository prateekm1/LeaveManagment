import { LightningElement } from 'lwc';

export default class LeaveTracker extends LightningElement {

    refreshLeaveRequestsHandler(event){
        this.refs.myLeavesComp.refreshGrid();
    }
}