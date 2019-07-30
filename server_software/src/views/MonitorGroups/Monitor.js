import React, {Component} from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  InputGroup,
  Label,
  Row
} from 'reactstrap';
import axios from "axios";
import LoadingAnimation from "../../utils/LoadingAnimation";
import {getStyle} from "@coreui/coreui/dist/js/coreui-utilities";
import Select from 'react-select';
import MONITOR_TYPE from '../../utils/monitorTypes';


class Monitor extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      errors: []
    }
  }

  componentDidMount() {//on component mount, we try fetch data from db
    this.setState({loading: true});//make the loading animation begin
    axios.get('/api/monitors/edit/list', {params: {id: this.props.match.params.id}}).then(data => {//try fetch user data
      this.setState({data: data.data, loading: false});//update and stop loading animation
    }).catch(err => {
      this.props.history.push('/404');//go back, invalid ID to show
    });
  }

  onChange = e => {
    this.setState({data: {...this.state.data, [e.target.id]: e.target.value}});//edit fields while also storing it in state

  };
  update = () => {

  };
  onTypeSelect = selectedOption => {
    this.setState({data: {...this.state.data, type: selectedOption.label}});
    console.log(`Option selected:`, selectedOption);
  };


  render() {
    const buttonStyle = {//submit button style, with better colors to match theme
      backgroundColor: getStyle('--theme-light'),
      borderColor: getStyle('--theme-bland'),
      color: '#fff'
    };
    const options = [];
    for (let type in MONITOR_TYPE) {
      options.push({value: MONITOR_TYPE[type], label: MONITOR_TYPE[type]});
    }
    const customStyles = {
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? getStyle('--theme-light') : provided.backgroundColor,
      }),
    };

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"/>Monitor ID: {this.props.match.params.id}}</strong>
              </CardHeader>
              <CardBody>
                {this.state.loading ? <LoadingAnimation/> :
                  <Form noValidate>
                    <FormGroup>
                      <Label>Name</Label>
                      <InputGroup>
                        <Input value={this.state.data.name} onChange={this.onChange}
                               className={this.state.errors.name ? 'is-invalid' : ''} type="text" id="name" name="name"
                               placeholder="Name"/>
                        <FormFeedback>{this.state.errors.name}</FormFeedback>
                      </InputGroup>
                    </FormGroup>
                    <FormGroup>
                      <Label>Type</Label>
                      <Select
                        value={{label: this.state.data.type, value: this.state.data.type}}
                        onChange={this.onTypeSelect}
                        options={options}
                        styles={customStyles}
                      />
                    </FormGroup>


                    <FormGroup>
                      <Button type="submit" color="success" onClick={this.update} style={buttonStyle}
                              disabled={this.state.formLoading}>
                        {this.state.formLoading ? <span className="lds-tiny-dual-ring"/> : 'Submit'}
                      </Button>
                    </FormGroup>
                  </Form>

                }
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Monitor;
