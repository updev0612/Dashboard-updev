import { inject, observer } from "mobx-react";
import React, { ChangeEvent } from "react";
import DataList from "../components/table";
import Header from "../components/header";
import { initializeIcons } from "@uifabric/icons";
import { Layout,FabricButton  } from "../styled";
import { caseColumns } from "../constants/TableColumns/caseColumns";
import Pagination from '../components/Pagination';
import Menu from '../components/Menu';


import { Picker } from "../components/Form/picker";
initializeIcons();

type TableProps = {
  [key: string]: string;
};
interface IInjected {
  getAllCases: ICaseStore ;
}
interface IProps {
  itemsPerPage?: number;
  query?: object;
  history: {
    push(url: string): void;
  };
}

interface IState {
  currentPage: number;
  numberOfPages: number;
  searchValue?: string;
  modal?: (e: any) => void;
  items?: object[];
}

@inject(({ store }) => ({
  getAllCases: store.getAllCases
}))
@observer
class Home extends React.Component<IProps & IInjected, IState> {
  _t: number | null;
  constructor(props: IProps & IInjected) {
    super(props);
    this.state = {
      searchValue: '',
      numberOfPages: 0,
      currentPage: 1,
      items: []
    };
    this._t = null;
  }

  private getItemsWithPagination = async (page: number) => {
    const {query, getAllCases} = this.props;
    this.setState({ currentPage: page });
    const rowSize = 10;
    await getAllCases.fetch({
      itemsPerPage: rowSize ,
      currentPage: page,
      ...query
    });
    if ( getAllCases.data) {
      this.setState({
        numberOfPages: Math.ceil((getAllCases.data.count) / rowSize)
      });
    }
  } 
  componentDidMount() {
    const { getAllCases }: IInjected = this.props;
    const { currentPage } = this.state;
    this.getItemsWithPagination(currentPage);
  }

  handleClick = (id: number) => {
    const { history } = this.props;
    history.push("preview-case/" + id);
  };

  handleHome = () => {
    const { history } = this.props;
    history.push("/create");
  };

  changeCurrentPage = async (page: number) => {   
    if(this.state.currentPage !== page) {
      this.getItemsWithPagination(page)
    }
    this.setState({
      currentPage: page
    });
  };

  render(): JSX.Element {
    const { getAllCases } = this.props;
    const userItems = getAllCases.data ? getAllCases.data.rows : [];
    const { numberOfPages, currentPage } = this.state;
    return (

      <Layout displayFlex column>
      <FabricButton text="Create" styles={{ root: { width: 140, marginLeft:1370, marginTop:12}}} 
                onClick={this.handleHome}
      />  
        {
          <DataList
            search
            items={userItems}
            columns={caseColumns}
            onItemClick={this.handleClick}
            loading={getAllCases.loading}
            error={getAllCases.error}
            responseError={"Error"}
            
          />
        }
        <Layout  
        margin={'20px auto'}
        displayFlex
        justifyCenter
        alignCenter
 >
        {(
        <Pagination 
        numberOfPages={numberOfPages}
        currentPage={currentPage}
        changeCurrentPage={this.changeCurrentPage}
        />
        )}
        </Layout>
        </Layout>
    );
  }
}

export default (Home as unknown) as React.ComponentClass;
