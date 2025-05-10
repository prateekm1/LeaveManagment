import { LightningElement, wire, api } from 'lwc';
import getLeaveRequests from '@salesforce/apex/LeaveRequstController.getLeaveRequests';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import Id from '@salesforce/user/Id';
import {refreshApex} from '@salesforce/apex';
import Username from '@salesforce/schema/User.Username';


const COLUMNS = [
    {label: 'Request Id', fieldName:'Name', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'User', fieldName:'userName', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'From Date', fieldName:'From_Date__c', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'To Date', fieldName:'To_Date__c', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'Reason', fieldName:'Reason__c', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'Status', fieldName:'Status__c', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {label: 'Manager Comments', fieldName:'Manager_comment__c', cellAttributes: {class: {fieldName: 'cellClass'}}},
    {
        type:"button", typeAttributes :{
            label:'Edit',
            name:'Edit',
            Title:'Edit',
            value:'edit',
            disabled: {fieldName:'isEditDisabled'}
        }, cellAttributes: {class: {fieldName: 'cellClass'}}
    }
];

export default class LeaveRequests extends LightningElement {
    
    columns = COLUMNS;
    leavesRequests = [];
    leavesRequestWireResult;
    showModalPopup = false;
    objectApiName = 'LeaveRequest__c';
    recordId = '';
    currentUserId = Id;
    
    @wire(getLeaveRequests)
    wiredLeavesRequests(result){
        this.leavesRequestWireResult = result;
        if(result.data){
            this.leavesRequests = result.data.map(a => ({
                ...a,
                userName: a.User__r.Name,
                cellClass: a.Status__c == 'Approved' ? 'slds-theme_success' : a.Status__c == 'Rejected' ? 'slds-theme_warning' : '',
                isEditDisabled: a.Status__c != 'Pending'
            }));
        }
        if(result.error){
            console.log('Error occured in wire: ',result.error);
        }
    }

    get noRecordsFound(){
        return this.leavesRequests.length == 0;
    }

    newRequestClickHandler(){
        this.showModalPopup = true;
        this.recordId = '';
    }

    popupCloseHandler(){
        this.showModalPopup = false;
    }

    rowActionHandler(event){
        this.showModalPopup = true;
        this.recordId = event.detail.row.Id;
    }
    
    successHandler(event){
        this.showModalPopup = false;
        this.showToast('Data Saved Successfully');
        this.refreshGrid();
    }

    @api
    refreshGrid(){
        refreshApex(this.leavesRequestWireResult);
    }

    showToast(message, title='success', variant='success'){
        const event = new ShowToastEvent({
            title,
            message,
            variant
        });
        this.dispatchEvent(event);
    }
}