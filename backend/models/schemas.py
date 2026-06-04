from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any, Union

class AppMeta(BaseModel):
    app_name: str
    version: str
    generated_at: str
    assumptions: List[str]

class UIComponent(BaseModel):
    id: str
    type: str
    props: Dict[str, Any]
    data_source: Optional[str] = None

class UIPage(BaseModel):
    id: str
    name: str
    route: str
    auth_required: bool
    role_access: List[str]
    components: List[UIComponent]

class UI(BaseModel):
    pages: List[UIPage]

class APIEndpoint(BaseModel):
    id: str
    method: str
    path: str
    auth_required: bool
    roles: List[str]
    request_body: Optional[Dict[str, Any]] = {}
    response_schema: Optional[Dict[str, Any]] = {}
    db_table: Optional[str] = None

class API(BaseModel):
    endpoints: List[APIEndpoint]

class DBColumn(BaseModel):
    name: str
    type: str
    nullable: bool
    primary_key: bool

class DBTable(BaseModel):
    name: str
    columns: List[DBColumn]
    relations: List[Any]

class DB(BaseModel):
    tables: List[DBTable]

class AuthPermissions(BaseModel):
    resource: List[str]

class Auth(BaseModel):
    strategy: str
    roles: List[str]
    permissions: Dict[str, AuthPermissions]

class MasterSchema(BaseModel):
    meta: AppMeta
    ui: UI
    api: API
    db: DB
    auth: Auth

class PipelineResult(BaseModel):
    status: str
    stages: Dict[str, Any]
    repair_log: List[str]
    assumptions: List[str]
    metrics: Dict[str, Any]
    logs: List[str]

class EvalResult(BaseModel):
    pass
