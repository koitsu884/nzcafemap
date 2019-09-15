import React from 'react';
import { Tabs, TabPanel, TabList, Tab} from 'react-tabs';
import Account from './Help/Account';
import Cafe from './Help/Cafe';
import Search from './Help/Search';

export default function Help() {
    return (
        <div className="help">
            <h1>使い方</h1>
            <Tabs>
                <TabList>
                    <Tab>検索</Tab>
                    <Tab>アカウント</Tab>
                    <Tab>カフェ情報・レビュー</Tab>
                </TabList>
                <TabPanel>
                    <Search />
                </TabPanel>
                <TabPanel>
                    <Account />
                </TabPanel>
                <TabPanel>
                    <Cafe />
                </TabPanel>
            </Tabs>
        </div>
    )
}
