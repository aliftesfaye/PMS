import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Fade,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  AvatarGroup,
  Chip,
  useTheme,
  useMediaQuery,
  Tooltip,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import EngineeringIcon from "@mui/icons-material/Engineering";
import RefreshIcon from "@mui/icons-material/Refresh";
import apiService from "../services/apiServices";

// Styled components for better maintainability
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  "&.header-cell": {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    fontWeight: 600,
    fontSize: "0.875rem",
    letterSpacing: "0.5px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  height: 56,
  "&:nth-of-type(even)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:hover": {
    backgroundColor: theme.palette.action.selected,
    transition: "background-color 0.2s ease",
  },
  "&:last-child td, &:last-child th": {
    borderBottom: 0,
  },
}));

const MemberCell = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(1),
}));

const RoleChip = styled(Chip)(({ theme, role }) => ({
  fontWeight: 500,
  fontSize: "0.75rem",
  ...(role === "manager" && {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
  }),
  ...(role === "technical" && {
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
  }),
  ...(role === "member" && {
    backgroundColor: theme.palette.grey[200],
    color: theme.palette.grey[700],
  }),
}));

const ProjectHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  paddingBottom: theme.spacing(2),
  borderBottom: `2px solid ${theme.palette.primary.main}`,
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
    gap: theme.spacing(2),
  },
}));

const ProjectDetail = ({ selectedRow }) => {
  const [projects, setProjects] = useState([]);
  const [userInfo, setUserInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userInfo")) || {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const fetchProjects = useCallback(async () => {
    try {
      console.log("Fetching projects...");
      setLoading(true);
      setError(null);

      const projectsData = await apiService.getAllProjects(
        userInfo.access_token,
        selectedRow
      );

      const sortedResponse = projectsData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setProjects(sortedResponse);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setError("Failed to load projects. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userInfo.access_token, selectedRow]);

  useEffect(() => {
    fetchProjects();

    // Initialize user info from localStorage
    const initializeUserInfo = () => {
      const storedInfo = localStorage.getItem("userInfo");
      if (storedInfo) {
        try {
          setUserInfo(JSON.parse(storedInfo));
        } catch (err) {
          console.error("Error parsing user info:", err);
        }
      }
    };
    initializeUserInfo();
  }, [fetchProjects]);

  const renderMemberWithAvatar = (member, role) => {
    if (!member) return null;

    const initials =
      member.UserRoleToUser?.full_name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

    const roleType =
      role === "project_manager"
        ? "manager"
        : role === "technical_manager"
        ? "technical"
        : "member";

    return (
      <MemberCell>
        <Tooltip title={member.UserRoleToUser?.full_name || "Unknown"}>
          <Avatar
            sx={{
              width: 32,
              height: 32,
              bgcolor:
                roleType === "manager"
                  ? "primary.main"
                  : roleType === "technical"
                  ? "secondary.main"
                  : "grey.500",
              fontSize: "0.875rem",
            }}
          >
            {initials}
          </Avatar>
        </Tooltip>
        <Box>
          <Typography variant="body2" fontWeight={500}>
            {member.UserRoleToUser?.full_name || "Unknown"}
          </Typography>
          <RoleChip
            label={roleType.charAt(0).toUpperCase() + roleType.slice(1)}
            size="small"
            role={roleType}
          />
        </Box>
      </MemberCell>
    );
  };

  const mergeRows = useMemo(() => {
    const maxLength = Math.max(
      selectedRow.project_manager?.length || 0,
      selectedRow.technical_manager?.length || 0,
      selectedRow.project_member?.length || 0
    );

    return Array.from({ length: maxLength }).map((_, index) => (
      <StyledTableRow key={index}>
        <StyledTableCell>
          {selectedRow.project_manager?.[index] ? (
            renderMemberWithAvatar(
              selectedRow.project_manager[index],
              "project_manager"
            )
          ) : (
            <Typography color="text.secondary" variant="body2">
              -
            </Typography>
          )}
        </StyledTableCell>
        <StyledTableCell>
          {selectedRow.technical_manager?.[index] ? (
            renderMemberWithAvatar(
              selectedRow.technical_manager[index],
              "technical_manager"
            )
          ) : (
            <Typography color="text.secondary" variant="body2">
              -
            </Typography>
          )}
        </StyledTableCell>
        <StyledTableCell>
          {selectedRow.project_member?.[index] ? (
            renderMemberWithAvatar(
              selectedRow.project_member[index],
              "project_member"
            )
          ) : (
            <Typography color="text.secondary" variant="body2">
              -
            </Typography>
          )}
        </StyledTableCell>
      </StyledTableRow>
    ));
  }, [selectedRow]);

  const getRoleStats = useMemo(
    () => ({
      projectManagers: selectedRow.project_manager?.length || 0,
      technicalManagers: selectedRow.technical_manager?.length || 0,
      projectMembers: selectedRow.project_member?.length || 0,
      total:
        (selectedRow.project_manager?.length || 0) +
        (selectedRow.technical_manager?.length || 0) +
        (selectedRow.project_member?.length || 0),
    }),
    [selectedRow]
  );

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
        <IconButton onClick={fetchProjects} color="primary">
          <RefreshIcon />
        </IconButton>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 4 },
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ProjectHeader>
        <Box>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            {selectedRow.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Chip
              icon={<GroupsIcon />}
              label={`${getRoleStats.total} Total Members`}
              color="primary"
              variant="outlined"
            />
            <Chip
              icon={<PersonOutlineIcon />}
              label={`${getRoleStats.projectManagers} PMs`}
              size="small"
            />
            <Chip
              icon={<EngineeringIcon />}
              label={`${getRoleStats.technicalManagers} TMs`}
              size="small"
            />
          </Box>
        </Box>
        <Tooltip title="Refresh members">
          <IconButton
            onClick={fetchProjects}
            disabled={loading}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              "&:disabled": { bgcolor: "grey.300" },
            }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </ProjectHeader>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Fade
          in={loading}
          style={{ transitionDelay: loading ? "100ms" : "0ms" }}
        >
          <LinearProgress sx={{ borderRadius: 1 }} />
        </Fade>

        <TableContainer
          component={Paper}
          sx={{
            flex: 1,
            borderRadius: 2,
            boxShadow: theme.shadows[2],
            "&:hover": {
              boxShadow: theme.shadows[4],
            },
            transition: "box-shadow 0.3s ease",
            overflow: "auto",
          }}
        >
          <Table
            stickyHeader
            sx={{
              minWidth: isMobile ? "100%" : 650,
              "& .MuiTableCell-root": {
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
            }}
          >
            <TableHead>
              <TableRow>
                <StyledTableCell className="header-cell">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PersonOutlineIcon fontSize="small" />
                    Project Manager
                  </Box>
                </StyledTableCell>
                <StyledTableCell className="header-cell">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <EngineeringIcon fontSize="small" />
                    Technical Manager
                  </Box>
                </StyledTableCell>
                <StyledTableCell className="header-cell">
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupsIcon fontSize="small" />
                    Project Members
                  </Box>
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {mergeRows.length > 0 ? (
                mergeRows
              ) : (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">
                      No members found for this project
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {!isMobile && (
          <Box
            sx={{
              mt: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Showing {mergeRows.length} members
            </Typography>
            <AvatarGroup max={4} sx={{ justifyContent: "flex-end" }}>
              {selectedRow.project_manager?.map((manager, index) => (
                <Tooltip key={index} title={manager.UserRoleToUser?.full_name}>
                  <Avatar sx={{ width: 28, height: 28 }} />
                </Tooltip>
              ))}
              {selectedRow.technical_manager?.map((manager, index) => (
                <Tooltip key={index} title={manager.UserRoleToUser?.full_name}>
                  <Avatar sx={{ width: 28, height: 28 }} />
                </Tooltip>
              ))}
            </AvatarGroup>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProjectDetail;
