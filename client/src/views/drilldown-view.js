import { html, LitElement } from '@polymer/lit-element';
import '../components/hpcc-chart.js';
import { sharedStyles } from '../styles/shared-styles.js';
import '@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout';
import '@polymer/paper-dialog';
import '@polymer/paper-button';
import {Comm} from '../js/Comm.js';
import {Properties} from '../js/Properties.js';

class DrilldownView extends LitElement {
   

  render() {
    return html`
    ${sharedStyles}          
          
          
    <div style="background-color:gray;width:100%">
      <vaadin-vertical-layout>
          <vaadin-horizonal-layout>
              <span style="background-color:gray; padding: 5px;text-align:center">Drilldown View</span>
              <paper-button style="text-align:center;color:blue" @click="${() => this.close()}">Close</paper-button> 
          </vaadin-horizonal-layout>

            
            ${this._charts_data.map((item) => html`
                <hpcc-chart  chart_type="${item.chart_type}" 
                    dataset_name="${item.dataset_name}" query_name="${item.query_name}" 
                    chart_title="${item.title} by ${this.filter_1}"
                    filter_1="${this.filter_1}"
                    has_drilldown="${item.has_drilldown}"
                    drilldown_dashboard_id="${item.drilldown_dashboard_id}"
                    drilldown_application_id="${item.drilldown_application_id}"></hpcc-chart>
            `)}
             
            <vaadin-horizonal-layout>
                <span style="background-color:gray; padding: 5px;text-align:center">Drilldown View</span>
                <paper-button style="text-align:center;color:blue" @click="${() => this.close()}">Close</paper-button> 
            </vaadin-horizonal-layout>
            
        </vaadin-vertical-layout>


      </div>
    
    `;
  }
  
  //${repeat(_charts_data, (item) => html` 

  constructor () {
    super();
    this._charts_data = [];
  }

  static get properties() {
    return {
      dashboard_id: {type: String},
      application_id: {type: String},
      filter_1: {type: String},
      filter_2: {type: String},
      _charts_data: {type: Object}
    }
  }

  open() {
    this.hidden = false;
    this.initData();
  }

  initData() {
    let serviceURL = Properties.get_das_server_url()+ "/WsEcl/soap/query/roxie/das_dashboard_charts_query.1";
    let serviceContent = {
      "das_dashboard_charts_query.1": {
        "dashboard_id": this.dashboard_id,
        "application_id": this.application_id,
        "filter_1": this.filter_1
      }
    };

    Comm.getData(serviceURL, serviceContent, 'dashboard_charts' ,this);

    console.log('init data called: ' + this.dashboard_id +
      ' , Service URL: ' + serviceURL +
      ', Content:  ' + JSON.stringify(serviceContent));
  }

  close() {
    this.hidden = true; 
  }


  receiveData(respType, resp) {
    let dashResult = jsonPath(resp, '$..dashboard_charts_data');
    this._charts_data = dashResult[0].Row;
    console.log(JSON.stringify(this._charts_data));
  }
}

window.customElements.define('drilldown-view', DrilldownView);