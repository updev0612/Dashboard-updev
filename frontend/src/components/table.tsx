import * as React from "react";
import routes from "../constants/routes";

import {
  IDetailsListStyles,
  CheckboxVisibility,
  IColumn,
  DetailsList,
  Link,
  DetailsListLayoutMode,
  SearchBox,
  buildColumns,
  Icon
} from "office-ui-fabric-react";
import RootStore from "../store/RootStore";
import { Layout, FabricDetailsList, SHADOWS, FabricButton } from "../styled";
import { ICase } from "../constants/caseInterfaces";
import ErrorBar from "./MessageBar";
import Loader from "./Loader/index";

interface IProps {
  items?: ICase[] | any[];
  endpoint?: string;
  store?: RootStore;
  columns?: IColumn[];
  reverse?: boolean;
  onItemClick?: (e: number) => void;
  loading?: boolean;
  error?: any;
  responseError?: string;
  search?: boolean;
  history?: {
    push(url: string): void;
  };
 
}

interface IMyComponentState {
  rows: ICase[] | any[];
  stateFlag: boolean;

}

class Table extends React.Component<IProps, IMyComponentState> {
  constructor(props: IProps) {
    super(props);
    this.setState({
      stateFlag: false
    });
    this.fire = this.fire.bind(this);
  }
  fire(newValue: any) {
    const { items } = this.props;
    var rows = items
      ? items.filter(function(element, index, array) {
          if (
              (element.caseNumber && element.caseNumber.includes(newValue)) ||
              (element.subject && element.subject.includes(newValue)) ||
              (element.claimedAmount && element.claimedAmount == newValue) ||
              (element.fileLocation && element.fileLocation.includes(newValue)) ||
              (element.registrationDate && element.registrationDate.includes(newValue)) ||
              (element.caseStatus && element.caseStatus.includes(newValue))
          ) {
            return element;
          }
        })
      : [];
    this.setState({
      rows: rows,
      stateFlag: true
    });
  }

  componentWillMount() {
    const { items } = this.props;
    this.setState({
      rows: items ? items : [],
      stateFlag: false
    });
  }
  
  
  public handleActiveItem = (e: any) => {
    const { onItemClick } = this.props;
    if (onItemClick) onItemClick(e.id);
  };


  public onRenderItemColumn = (
    item?: ICase,
    index?: number,
    column?: IColumn
  ): React.ReactNode => {
    const { reverse } = this.props;
    if (column && item) {

      // console.log(item, column.fieldName);

      const fieldContent = item[column.fieldName as keyof ICase] as
        | string
        | string[];

      switch (column.data) {
        case "link":
          return <a href={fieldContent as string}>{fieldContent}</a>
        case "date":
          const date = new Date(fieldContent as string);
          return (
            <span>
              {date.getDate()}-{date.getMonth()}-{date.getFullYear()}{" "}
            </span>
          );
        case "array":
          const arrayFieldContent: string[] = fieldContent as string[];
          return (
            <Layout displayFlex column={!reverse}>
              {Array.isArray(arrayFieldContent) ? arrayFieldContent.map((value: string) => {
                return !!reverse ? (
                  <Layout padding="0px 20px 0px 0px">
                    <p>&#8226;{value}</p>
                  </Layout>
                ) : (
                  <Layout padding="0px 0px 20px 0px">
                    <p>&#8226;{value}</p>
                  </Layout>
                );
              }) : 'ss'}
            </Layout>
          );
        case "action":
              return <Icon iconName="EditSolid12" />
        default:
          return <span>{fieldContent}</span>;
      }
    }
    function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
      const key = columnKey as keyof T;
      return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
    }
  };

  render(): JSX.Element {
    const {
      items,
      columns,
      reverse,
      search,
      loading,
      error,
      responseError
    } = this.props;
    const columns1 = buildColumns([
      {
        caseNumber: "",
        subject: "",
        fileLocation: "",
        registrationDate: "",
        claimedAmount: "",
        actions: ""
        
      }
    ]);
    const tableStyles: Partial<IDetailsListStyles> = reverse
      ? {
          headerWrapper: {
            display: "flex",
            flexDirection: "column",
            height: "auto",
            minWidth: "200px",
            maxWidth: "300px"
          },
          root: {
            padding: "0px 20px",
            margin: "20px 0px 20px 100px",
            overflow: "hidden",
            boxShadow: SHADOWS.FORM,
            width: "100%"
          }
        }
      : {
          headerWrapper: {
            width: "max-content"
          },
          root: {
            padding: "0px 20px",
            margin: "20px 0px 20px 100px",
            overflow: "hidden",
            boxShadow: SHADOWS.FORM
          }
        };
    return !search ? (
      <Layout width="max-content">
        {items && (
          <FabricDetailsList
            reverse={!!reverse}
            checkboxVisibility={CheckboxVisibility.hidden}
            styles={tableStyles}
            items={items}
            ariaLabel="lalalalalalallaa"
            checkButtonAriaLabel="check"
            className="headerWrapper"
            columns={columns}
            onRenderItemColumn={this.onRenderItemColumn}
            layoutMode={DetailsListLayoutMode.fixedColumns}
          />
        )}
      </Layout>
    ) : (
      <div>
        {items && (
          <div>
            <div style={{display: 'flex'}}>
            <SearchBox
              styles={{ root: { width: 250, marginLeft:2 } }}
              placeholder="Search"
              onChange={(_, newValue) => this.fire(newValue)}
            />
            </div>

            <DetailsList
              checkboxVisibility={CheckboxVisibility.hidden}
              items={this.state.stateFlag ? this.state.rows : items}
              columns={columns}
              onRenderItemColumn={this.onRenderItemColumn}
              setKey="set"
              onActiveItemChanged={e => this.handleActiveItem(e)}
              ariaLabel="lalalalalalallaa"
              checkButtonAriaLabel="check"
              
            />
            {loading && <Loader />}

            {error && ErrorBar(responseError ? responseError : "")}
          </div>
        )}
      </div>
    );
  }

  
}
// max-width: 70vw;

// overflow: hidden;
export default Table;
